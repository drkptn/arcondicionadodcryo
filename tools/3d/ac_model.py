"""
Modelo procedural da unidade interna (split hi-wall) usada no site da DCRYO.

O mesmo modelo alimenta:
  - o GLB carregado no hero / seção de tecnologia (public/models/split.glb)
  - os renders ilustrativos da galeria (public/images/*)

Uso: importado por build_glb.py e render_scenes.py (rodam com o módulo `bpy`).
Eixos (Blender): X = largura, -Y = frente do aparelho, Z = altura.
"""

import math

import bpy  # noqa: I001  (precisa vir antes de bmesh)
import bmesh

# Dimensões em metros
W = 0.92
H = 0.295
D = 0.205

END = 0.036          # largura das "tampas" laterais sem rasgo de saída de ar
NOTCH_T0 = -17.0     # início/fim do rasgo de saída de ar ao longo do arco inferior
NOTCH_T1 = -76.0
NOTCH_DEPTH = 0.036
FLAP_MAX_DEG = 40.0  # rotação em +X abre a aleta (igual no glTF / three.js)

ELL_C = (0.085, 0.098)   # centro do arco elíptico inferior (u, v)
ELL_A = D - 0.085
ELL_B = 0.098


def _arc(cu, cv, r, a0, a1, n):
    out = []
    for i in range(n + 1):
        a = math.radians(a0 + (a1 - a0) * i / n)
        out.append((cu + r * math.cos(a), cv + r * math.sin(a)))
    return out


def _ell(t_deg):
    t = math.radians(t_deg)
    return (ELL_C[0] + ELL_A * math.cos(t), ELL_C[1] + ELL_B * math.sin(t))


def _ell_normal(t_deg):
    t = math.radians(t_deg)
    nu, nv = math.cos(t) / ELL_A, math.sin(t) / ELL_B
    ln = math.hypot(nu, nv)
    return (nu / ln, nv / ln)


def _ell_pts(t0, t1, n):
    return [_ell(t0 + (t1 - t0) * i / n) for i in range(n + 1)]


def _ell_offset(t0, t1, n, off):
    out = []
    for i in range(n + 1):
        t = t0 + (t1 - t0) * i / n
        p, nn = _ell(t), _ell_normal(t)
        out.append((p[0] + nn[0] * off, p[1] + nn[1] * off))
    return out


def body_profile(notched):
    """Perfil lateral fechado (u = profundidade p/ frente, v = altura), sentido horário.
    Retorna (pontos, conjunto de índices de segmentos internos ao rasgo)."""
    pts = [(0.0, 0.018), (0.0, H - 0.008)]
    pts += _arc(0.008, H - 0.008, 0.008, 180, 90, 6)[1:]
    pts.append((D - 0.046, H))
    pts += _arc(D - 0.046, H - 0.046, 0.046, 90, 0, 22)[1:]
    pts.append((D, ELL_C[1]))
    dark = set()
    if notched:
        pts += _ell_pts(0, NOTCH_T0, 6)[1:]
        i0 = len(pts) - 1
        pts += _ell_offset(NOTCH_T0, NOTCH_T1, 26, -NOTCH_DEPTH)
        pts.append(_ell(NOTCH_T1))
        i1 = len(pts) - 1
        dark = set(range(i0, i1))
        pts += _ell_pts(NOTCH_T1, -90, 6)[1:]
    else:
        pts += _ell_pts(0, -90, 40)[1:]
    pts.append((0.018, 0.0))
    pts += _arc(0.018, 0.018, 0.018, 270, 180, 8)[1:-1]
    return pts, dark


def _prism(bm, prof, x0, x1, cap0=True, cap1=True, seg_mat=None, cap_mat=(0, 0)):
    n = len(prof)
    v0 = [bm.verts.new((x0, -u, v)) for (u, v) in prof]
    v1 = [bm.verts.new((x1, -u, v)) for (u, v) in prof]
    for i in range(n):
        j = (i + 1) % n
        f = bm.faces.new((v0[i], v0[j], v1[j], v1[i]))
        f.material_index = seg_mat(i) if seg_mat else 0
        f.smooth = True
    if cap0:
        f = bm.faces.new(v0[::-1])
        f.material_index = cap_mat[0]
    if cap1:
        f = bm.faces.new(v1)
        f.material_index = cap_mat[1]
    return v0, v1


def _loop_edges(bm, verts):
    edges = []
    n = len(verts)
    for i in range(n):
        e = bm.edges.get((verts[i], verts[(i + 1) % n]))
        if e:
            edges.append(e)
    return edges


def _finish(bm, name, mats, sharp_deg=32):
    bmesh.ops.remove_doubles(bm, verts=bm.verts, dist=1e-6)
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    me = bpy.data.meshes.new(name)
    bm.to_mesh(me)
    bm.free()
    for m in mats:
        me.materials.append(m)
    for p in me.polygons:
        p.use_smooth = True
    me.set_sharp_from_angle(angle=math.radians(sharp_deg))
    ob = bpy.data.objects.new(name, me)
    return ob


def _shell_profile(pts, off_out, off_in):
    """Casca fina seguindo uma polilinha aberta (perfil horário => normal externa à esquerda)."""
    normals = []
    n = len(pts)
    for i in range(n):
        a = pts[max(i - 1, 0)]
        b = pts[min(i + 1, n - 1)]
        du, dv = b[0] - a[0], b[1] - a[1]
        ln = math.hypot(du, dv) or 1.0
        normals.append((-dv / ln, du / ln))
    outer = [(p[0] + nn[0] * off_out, p[1] + nn[1] * off_out) for p, nn in zip(pts, normals)]
    inner = [(p[0] + nn[0] * off_in, p[1] + nn[1] * off_in) for p, nn in zip(pts, normals)]
    return outer + inner[::-1]


def _shell(name, pts, off_out, off_in, x0, x1, mat, bevel=0.0012, origin=None):
    prof = _shell_profile(pts, off_out, off_in)
    m = len(pts)
    bm = bmesh.new()
    v0, v1 = _prism(bm, prof, x0, x1)
    edges = _loop_edges(bm, v0) + _loop_edges(bm, v1)
    for k in (0, m - 1, m, 2 * m - 1):
        e = bm.edges.get((v0[k], v1[k]))
        if e:
            edges.append(e)
    if bevel > 0:
        bmesh.ops.bevel(bm, geom=list(set(edges)), offset=bevel, offset_type='OFFSET',
                        segments=3, profile=0.5, affect='EDGES', clamp_overlap=True)
    if origin is not None:
        for v in bm.verts:
            v.co.x -= origin[0]
            v.co.y -= origin[1]
            v.co.z -= origin[2]
    ob = _finish(bm, name, [mat], sharp_deg=40)
    if origin is not None:
        ob.location = origin
    return ob


def _box(bm, cx, cy, cz, sx, sy, sz, mat_index=0):
    res = bmesh.ops.create_cube(bm, size=1.0)
    for v in res['verts']:
        v.co.x = cx + v.co.x * sx
        v.co.y = cy + v.co.y * sy
        v.co.z = cz + v.co.z * sz
    for f in {f for v in res['verts'] for f in v.link_faces}:
        f.material_index = mat_index
    return res['verts']


def make_material(name, color, rough=0.5, metal=0.0, coat=0.0, emission=None, emission_strength=0.0):
    m = bpy.data.materials.get(name) or bpy.data.materials.new(name)
    m.use_nodes = True
    bsdf = m.node_tree.nodes.get("Principled BSDF")
    bsdf.inputs["Base Color"].default_value = (*color, 1.0)
    bsdf.inputs["Roughness"].default_value = rough
    bsdf.inputs["Metallic"].default_value = metal
    if coat > 0:
        bsdf.inputs["Coat Weight"].default_value = coat
        bsdf.inputs["Coat Roughness"].default_value = 0.06
    if emission is not None:
        bsdf.inputs["Emission Color"].default_value = (*emission, 1.0)
        bsdf.inputs["Emission Strength"].default_value = emission_strength
    return m


def ac_materials():
    return {
        "body": make_material("AC_Body", (0.86, 0.87, 0.88), rough=0.42),
        "panel": make_material("AC_Panel", (0.92, 0.93, 0.94), rough=0.16, coat=0.6),
        "metal": make_material("AC_Metal", (0.72, 0.75, 0.79), rough=0.28, metal=1.0),
        "dark": make_material("AC_Dark", (0.012, 0.014, 0.018), rough=0.55),
        "vane": make_material("AC_Vane", (0.045, 0.05, 0.06), rough=0.45),
        "display": make_material("AC_Display", (0.0, 0.0, 0.0), rough=0.3,
                                 emission=(0.62, 0.82, 1.0), emission_strength=0.0),
    }


def build_ac(collection=None, name="Split", flap_open=0.0, with_display=True):
    """Cria a unidade interna. Retorna dict com o objeto raiz e as partes.
    flap_open: 0 (fechada) .. 1 (aberta)."""
    collection = collection or bpy.context.scene.collection
    mats = ac_materials()
    parts = {}

    # --- Corpo -------------------------------------------------------------
    plain, _ = body_profile(False)
    notch, dark = body_profile(True)
    bm = bmesh.new()
    xl, xr = -W / 2, W / 2
    a0, a1 = _prism(bm, plain, xl, xl + END, cap_mat=(0, 1))
    bmesh.ops.bevel(bm, geom=_loop_edges(bm, a0), offset=0.013, offset_type='OFFSET',
                    segments=8, profile=0.5, affect='EDGES', clamp_overlap=True)
    _prism(bm, notch, xl + END, xr - END, cap0=False, cap1=False,
           seg_mat=lambda i: 1 if i in dark else 0)
    b0, b1 = _prism(bm, plain, xr - END, xr, cap_mat=(1, 0))
    bmesh.ops.bevel(bm, geom=_loop_edges(bm, b1), offset=0.013, offset_type='OFFSET',
                    segments=8, profile=0.5, affect='EDGES', clamp_overlap=True)
    body = _finish(bm, f"{name}_Body", [mats["body"], mats["dark"]])
    parts["body"] = body

    # índices úteis do perfil liso
    top_arc_start = 2 + 6 + 1            # primeiro ponto do arco superior frontal
    front_top = top_arc_start + 22 - 1    # (D, H-0.046)
    front_bottom = front_top + 1          # (D, ELL_C.v)

    inset = 0.021
    # --- Painel frontal (casca brilhante) -----------------------------------
    panel_pts = plain[top_arc_start - 1 + 5: front_bottom + 1]
    panel_pts = panel_pts[:-1] + [(D, ELL_C[1] + 0.006)]
    parts["panel"] = _shell(f"{name}_Panel", panel_pts, 0.0028, -0.002,
                            xl + inset, xr - inset, mats["panel"], bevel=0.0011)

    # --- Filete metálico ------------------------------------------------------
    strip_pts = [(D, ELL_C[1] + 0.0035)] + _ell_pts(0, -9.5, 6)
    parts["strip"] = _shell(f"{name}_Strip", strip_pts, 0.0022, -0.002,
                            xl + inset, xr - inset, mats["metal"], bevel=0.0006)

    # --- Aleta (flap) ---------------------------------------------------------
    f0, f1 = -13.0, -80.0
    flap_pts = _ell_pts(f0, f1, 30)
    hinge_uv = _ell(f1 + 6)
    hinge = (0.0, -hinge_uv[0] + 0.004, hinge_uv[1] + 0.004)
    flap = _shell(f"{name}_Flap", flap_pts, 0.0016, -0.0034,
                  xl + END + 0.004, xr - END - 0.004, mats["panel"], bevel=0.0009, origin=hinge)
    flap.rotation_euler = (math.radians(FLAP_MAX_DEG * flap_open), 0, 0)
    parts["flap"] = flap

    # --- Aletas verticais dentro da saída de ar -------------------------------
    bm = bmesh.new()
    mid_t = (NOTCH_T0 + NOTCH_T1) / 2
    cu, cv = _ell(mid_t)
    nu, nv = _ell_normal(mid_t)
    depth = NOTCH_DEPTH * 0.5
    pu, pv = cu - nu * (NOTCH_DEPTH - depth / 2 - 0.002), cv - nv * (NOTCH_DEPTH - depth / 2 - 0.002)
    ang = math.atan2(nv, nu)
    count = 17
    span = W - 2 * END - 0.06
    for i in range(count):
        x = -span / 2 + span * i / (count - 1)
        verts = _box(bm, 0, 0, 0, 0.0020, depth, 0.058)
        for v in verts:
            y, z = v.co.y, v.co.z
            # eixo local Y -> direção da normal (u, v) do arco; gira em torno de X
            uu = y * math.cos(ang) - z * math.sin(ang)
            vv = y * math.sin(ang) + z * math.cos(ang)
            v.co.x = x + v.co.x
            v.co.y = -(pu + uu)
            v.co.z = pv + vv
    parts["vanes"] = _finish(bm, f"{name}_Vanes", [mats["vane"]], sharp_deg=20)

    # --- Grade de entrada de ar (topo) ----------------------------------------
    bm = bmesh.new()
    gx = W - 2 * 0.07
    _box(bm, 0, -0.082, H + 0.0002, gx, 0.108, 0.0006, 1)
    rows = 9
    for i in range(rows):
        y = -0.034 - i * 0.012
        _box(bm, 0, y, H + 0.0012, gx, 0.0052, 0.0022, 0)
    cols = 5
    for i in range(cols):
        x = -gx / 2 + gx * i / (cols - 1)
        _box(bm, x, -0.082, H + 0.0012, 0.006, 0.108, 0.0022, 0)
    parts["grille"] = _finish(bm, f"{name}_Grille", [mats["body"], mats["dark"]], sharp_deg=20)

    # --- Display -----------------------------------------------------------------
    if with_display:
        dw, dh = 0.094, 0.040
        cx, cz = W / 2 - 0.125, 0.186
        y = -(D + 0.0028 + 0.0004)
        me = bpy.data.meshes.new(f"{name}_Display")
        me.from_pydata(
            [(cx - dw / 2, y, cz - dh / 2), (cx + dw / 2, y, cz - dh / 2),
             (cx + dw / 2, y, cz + dh / 2), (cx - dw / 2, y, cz + dh / 2)],
            [], [(0, 1, 2, 3)])
        uv = me.uv_layers.new(name="UVMap")
        for li, co in enumerate([(0, 0), (1, 0), (1, 1), (0, 1)]):
            uv.data[li].uv = co
        me.materials.append(mats["display"])
        disp = bpy.data.objects.new(f"{name}_Display", me)
        parts["display"] = disp

    root = bpy.data.objects.new(name, None)
    collection.objects.link(root)
    for ob in parts.values():
        collection.objects.link(ob)
        ob.parent = root
    parts["root"] = root
    return parts
