"""
Renders ilustrativos (Cycles/CPU) usados no site: produto com fundo transparente
e ambientes da galeria. Tudo é procedural — nenhuma textura ou modelo externo.

Uso:
  python tools/3d/render_scenes.py <pasta_saida> [cena ...] [--draft]

Cenas: product_hero product_front product_open sala quarto escritorio comercial
       detalhe_display detalhe_acabamento reuniao
"""
import math
import os
import random
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)

import bpy  # noqa: E402
import numpy as np  # noqa: E402
from mathutils import Vector  # noqa: E402

import ac_model  # noqa: E402
import common  # noqa: E402

DRAFT = "--draft" in sys.argv
ARGS = [a for a in sys.argv[1:] if not a.startswith("--")]
OUT = ARGS[0] if ARGS else "/tmp/renders"
ONLY = ARGS[1:]


# --------------------------------------------------------------------------
# Materiais
# --------------------------------------------------------------------------
def mat(name, color, rough=0.6, metal=0.0, coat=0.0, bump=None, emission=None, strength=0.0):
    m = ac_model.make_material(name, color, rough, metal, coat, emission, strength)
    if bump:
        scale, amount = bump
        nt = m.node_tree
        bsdf = nt.nodes["Principled BSDF"]
        tex = nt.nodes.new("ShaderNodeTexNoise")
        tex.inputs["Scale"].default_value = scale
        tex.inputs["Detail"].default_value = 8
        coord = nt.nodes.new("ShaderNodeTexCoord")
        nt.links.new(coord.outputs["Object"], tex.inputs["Vector"])
        b = nt.nodes.new("ShaderNodeBump")
        b.inputs["Strength"].default_value = amount
        b.inputs["Distance"].default_value = 0.002
        nt.links.new(tex.outputs["Fac"], b.inputs["Height"])
        nt.links.new(b.outputs["Normal"], bsdf.inputs["Normal"])
    return m


def wood_floor(name, c1, c2, rough=0.38, plank=(1.6, 0.16)):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    nt = m.node_tree
    bsdf = nt.nodes["Principled BSDF"]
    coord = nt.nodes.new("ShaderNodeTexCoord")
    brick = nt.nodes.new("ShaderNodeTexBrick")
    brick.offset = 0.37
    brick.inputs["Color1"].default_value = (*c1, 1)
    brick.inputs["Color2"].default_value = (*c2, 1)
    brick.inputs["Mortar"].default_value = (c1[0] * 0.25, c1[1] * 0.25, c1[2] * 0.25, 1)
    brick.inputs["Scale"].default_value = 1.0
    brick.inputs["Mortar Size"].default_value = 0.0025
    brick.inputs["Mortar Smooth"].default_value = 0.4
    brick.inputs["Bias"].default_value = 0.0
    brick.inputs["Brick Width"].default_value = plank[0]
    brick.inputs["Row Height"].default_value = plank[1]
    nt.links.new(coord.outputs["Object"], brick.inputs["Vector"])
    mapping = nt.nodes.new("ShaderNodeMapping")
    mapping.inputs["Scale"].default_value = (1.2, 26.0, 1.0)
    nt.links.new(coord.outputs["Object"], mapping.inputs["Vector"])
    grain = nt.nodes.new("ShaderNodeTexNoise")
    grain.inputs["Scale"].default_value = 3.0
    grain.inputs["Detail"].default_value = 10
    grain.inputs["Roughness"].default_value = 0.65
    nt.links.new(mapping.outputs["Vector"], grain.inputs["Vector"])
    ramp = nt.nodes.new("ShaderNodeValToRGB")
    ramp.color_ramp.elements[0].position = 0.3
    ramp.color_ramp.elements[0].color = (0.62, 0.62, 0.62, 1)
    ramp.color_ramp.elements[1].position = 0.75
    ramp.color_ramp.elements[1].color = (1.0, 1.0, 1.0, 1)
    nt.links.new(grain.outputs["Fac"], ramp.inputs["Fac"])
    mix = nt.nodes.new("ShaderNodeMix")
    mix.data_type = 'RGBA'
    mix.blend_type = 'MULTIPLY'
    mix.inputs["Factor"].default_value = 1.0
    nt.links.new(brick.outputs["Color"], mix.inputs["A"])
    nt.links.new(ramp.outputs["Color"], mix.inputs["B"])
    nt.links.new(mix.outputs["Result"], bsdf.inputs["Base Color"])
    bsdf.inputs["Roughness"].default_value = rough
    b = nt.nodes.new("ShaderNodeBump")
    b.inputs["Strength"].default_value = 0.25
    b.inputs["Distance"].default_value = 0.001
    b.invert = True
    nt.links.new(brick.outputs["Fac"], b.inputs["Height"])
    nt.links.new(b.outputs["Normal"], bsdf.inputs["Normal"])
    return m


def concrete(name, base=(0.33, 0.34, 0.36), rough=0.55):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    nt = m.node_tree
    bsdf = nt.nodes["Principled BSDF"]
    coord = nt.nodes.new("ShaderNodeTexCoord")
    n1 = nt.nodes.new("ShaderNodeTexNoise")
    n1.inputs["Scale"].default_value = 1.4
    n1.inputs["Detail"].default_value = 12
    n1.inputs["Roughness"].default_value = 0.7
    nt.links.new(coord.outputs["Object"], n1.inputs["Vector"])
    ramp = nt.nodes.new("ShaderNodeValToRGB")
    ramp.color_ramp.elements[0].position = 0.25
    ramp.color_ramp.elements[0].color = (base[0] * 0.72, base[1] * 0.72, base[2] * 0.72, 1)
    ramp.color_ramp.elements[1].position = 0.8
    ramp.color_ramp.elements[1].color = (base[0] * 1.15, base[1] * 1.15, base[2] * 1.15, 1)
    nt.links.new(n1.outputs["Fac"], ramp.inputs["Fac"])
    nt.links.new(ramp.outputs["Color"], bsdf.inputs["Base Color"])
    n2 = nt.nodes.new("ShaderNodeTexNoise")
    n2.inputs["Scale"].default_value = 60
    n2.inputs["Detail"].default_value = 6
    nt.links.new(coord.outputs["Object"], n2.inputs["Vector"])
    b = nt.nodes.new("ShaderNodeBump")
    b.inputs["Strength"].default_value = 0.12
    b.inputs["Distance"].default_value = 0.002
    nt.links.new(n2.outputs["Fac"], b.inputs["Height"])
    nt.links.new(b.outputs["Normal"], bsdf.inputs["Normal"])
    bsdf.inputs["Roughness"].default_value = rough
    return m


def sheer(name, color=(0.9, 0.92, 0.95)):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    nt = m.node_tree
    out = nt.nodes["Material Output"]
    nt.nodes.remove(nt.nodes["Principled BSDF"])
    d = nt.nodes.new("ShaderNodeBsdfDiffuse")
    d.inputs["Color"].default_value = (*color, 1)
    t = nt.nodes.new("ShaderNodeBsdfTranslucent")
    t.inputs["Color"].default_value = (*color, 1)
    tr = nt.nodes.new("ShaderNodeBsdfTransparent")
    mix1 = nt.nodes.new("ShaderNodeMixShader")
    mix1.inputs[0].default_value = 0.6
    nt.links.new(d.outputs[0], mix1.inputs[1])
    nt.links.new(t.outputs[0], mix1.inputs[2])
    mix2 = nt.nodes.new("ShaderNodeMixShader")
    mix2.inputs[0].default_value = 0.22
    nt.links.new(mix1.outputs[0], mix2.inputs[1])
    nt.links.new(tr.outputs[0], mix2.inputs[2])
    nt.links.new(mix2.outputs[0], out.inputs["Surface"])
    return m


def emissive(name, color, strength):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    nt = m.node_tree
    out = nt.nodes["Material Output"]
    nt.nodes.remove(nt.nodes["Principled BSDF"])
    e = nt.nodes.new("ShaderNodeEmission")
    e.inputs["Color"].default_value = (*color, 1)
    e.inputs["Strength"].default_value = strength
    nt.links.new(e.outputs[0], out.inputs["Surface"])
    return m


# --------------------------------------------------------------------------
# Display do aparelho (dígitos de 7 segmentos gerados por SDF)
# --------------------------------------------------------------------------
SEG = {'0': 'abcdef', '1': 'bc', '2': 'abged', '3': 'abgcd', '4': 'fgbc', '5': 'afgcd',
       '6': 'afgedc', '7': 'abc', '8': 'abcdefg', '9': 'abcdfg', 'C': 'afed'}


def display_image(text="22", w=512, h=218):
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    alpha = np.zeros((h, w), np.float32)

    def rrect(cx, cy, sx, sy):
        r = min(sx, sy)
        qx = np.abs(xx - cx) - (sx - r)
        qy = np.abs(yy - cy) - (sy - r)
        d = np.hypot(np.maximum(qx, 0), np.maximum(qy, 0)) + np.minimum(np.maximum(qx, qy), 0) - r
        return np.clip(0.5 - d, 0, 1)

    def digit(ch, x0, y0, dw, dh, t):
        nonlocal alpha
        hl = dw / 2 - t * 0.85
        vl = dh / 4 - t * 0.8
        segs = {
            'a': (x0 + dw / 2, y0 + dh - t / 2, hl, t / 2),
            'g': (x0 + dw / 2, y0 + dh / 2, hl, t / 2),
            'd': (x0 + dw / 2, y0 + t / 2, hl, t / 2),
            'f': (x0 + t / 2, y0 + dh * 0.75, t / 2, vl),
            'b': (x0 + dw - t / 2, y0 + dh * 0.75, t / 2, vl),
            'e': (x0 + t / 2, y0 + dh * 0.25, t / 2, vl),
            'c': (x0 + dw - t / 2, y0 + dh * 0.25, t / 2, vl),
        }
        for s in SEG[ch]:
            alpha = np.maximum(alpha, rrect(*segs[s]))

    dw, dh, t = 74, 132, 13
    x = 120
    y0 = (h - dh) / 2
    for ch in text:
        digit(ch, x, y0, dw, dh, t)
        x += dw + 26
    # símbolo de grau + C
    ring = np.abs(np.hypot(xx - (x + 10), yy - (y0 + dh - 16)) - 11) - 3.2
    alpha = np.maximum(alpha, np.clip(0.5 - ring, 0, 1))
    digit('C', x + 34, y0 + dh - 62, 34, 62, 7)

    img = bpy.data.images.new("DisplayTex", w, h, alpha=True)
    px = np.zeros((h, w, 4), np.float32)
    px[..., 0] = 0.78
    px[..., 1] = 0.9
    px[..., 2] = 1.0
    px[..., 3] = alpha
    img.pixels.foreach_set(px.ravel())
    img.pack()
    return img


def lit_display(parts, text="22", strength=5.0):
    disp = parts.get("display")
    if not disp:
        return
    img = display_image(text)
    m = bpy.data.materials.new("AC_DisplayLit")
    m.use_nodes = True
    nt = m.node_tree
    out = nt.nodes["Material Output"]
    nt.nodes.remove(nt.nodes["Principled BSDF"])
    tex = nt.nodes.new("ShaderNodeTexImage")
    tex.image = img
    e = nt.nodes.new("ShaderNodeEmission")
    e.inputs["Strength"].default_value = strength
    nt.links.new(tex.outputs["Color"], e.inputs["Color"])
    tr = nt.nodes.new("ShaderNodeBsdfTransparent")
    mix = nt.nodes.new("ShaderNodeMixShader")
    nt.links.new(tex.outputs["Alpha"], mix.inputs[0])
    nt.links.new(tr.outputs[0], mix.inputs[1])
    nt.links.new(e.outputs[0], mix.inputs[2])
    nt.links.new(mix.outputs[0], out.inputs["Surface"])
    disp.data.materials.clear()
    disp.data.materials.append(m)
    disp.visible_shadow = False


def hide_display(parts):
    d = parts.get("display")
    if d:
        d.hide_render = True


# --------------------------------------------------------------------------
# Primitivas
# --------------------------------------------------------------------------
def rbox(name, size, loc, material, bevel=0.012, seg=4, rot=(0, 0, 0)):
    bpy.ops.mesh.primitive_cube_add(size=1, location=loc, rotation=tuple(math.radians(r) for r in rot))
    ob = bpy.context.active_object
    ob.name = name
    ob.scale = size
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    if bevel > 0:
        mod = ob.modifiers.new("Bevel", 'BEVEL')
        mod.width = min(bevel, min(size) * 0.49)
        mod.segments = seg
        wn = ob.modifiers.new("WN", 'WEIGHTED_NORMAL')
        wn.keep_sharp = True
        for p in ob.data.polygons:
            p.use_smooth = True
    ob.data.materials.append(material)
    return ob


def cyl(name, radius, depth, loc, material, verts=64, rot=(0, 0, 0), bevel=0.0):
    bpy.ops.mesh.primitive_cylinder_add(vertices=verts, radius=radius, depth=depth, location=loc,
                                        rotation=tuple(math.radians(r) for r in rot))
    ob = bpy.context.active_object
    ob.name = name
    if bevel > 0:
        mod = ob.modifiers.new("Bevel", 'BEVEL')
        mod.width = bevel
        mod.segments = 3
        mod.limit_method = 'ANGLE'
        wn = ob.modifiers.new("WN", 'WEIGHTED_NORMAL')
        wn.keep_sharp = True
    for p in ob.data.polygons:
        p.use_smooth = True
    ob.data.set_sharp_from_angle(angle=math.radians(40))
    ob.data.materials.append(material)
    return ob


def sphere(name, radius, loc, material, scale=(1, 1, 1)):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=48, ring_count=24, radius=radius, location=loc)
    ob = bpy.context.active_object
    ob.name = name
    ob.scale = scale
    for p in ob.data.polygons:
        p.use_smooth = True
    ob.data.materials.append(material)
    return ob


def curtain(name, x, y0, y1, z0, z1, material, folds=14, amp=0.035, axis='y'):
    n = folds * 12
    verts, faces = [], []
    for i in range(n + 1):
        t = i / n
        s = y0 + (y1 - y0) * t
        off = amp * math.sin(t * folds * 2 * math.pi) + amp * 0.35 * math.sin(t * folds * 5.3)
        if axis == 'y':
            verts += [(x + off, s, z0), (x + off, s, z1)]
        else:
            verts += [(s, x + off, z0), (s, x + off, z1)]
    for i in range(n):
        a = i * 2
        faces.append((a, a + 2, a + 3, a + 1))
    me = bpy.data.meshes.new(name)
    me.from_pydata(verts, [], faces)
    for p in me.polygons:
        p.use_smooth = True
    me.materials.append(material)
    ob = bpy.data.objects.new(name, me)
    bpy.context.scene.collection.objects.link(ob)
    return ob


def branches(name, base, material, count=6, height=0.9, spread=0.35, seed=3):
    rnd = random.Random(seed)
    for i in range(count):
        cu = bpy.data.curves.new(f"{name}{i}", 'CURVE')
        cu.dimensions = '3D'
        cu.bevel_depth = 0.0035
        cu.bevel_resolution = 3
        sp = cu.splines.new('BEZIER')
        steps = 4
        sp.bezier_points.add(steps - 1)
        ang = rnd.uniform(0, math.tau)
        lean = rnd.uniform(0.25, 1.0) * spread
        hh = height * rnd.uniform(0.7, 1.0)
        for k, bp in enumerate(sp.bezier_points):
            t = k / (steps - 1)
            r = lean * t ** 1.6
            bp.co = (base[0] + math.cos(ang) * r + rnd.uniform(-0.02, 0.02) * t,
                     base[1] + math.sin(ang) * r + rnd.uniform(-0.02, 0.02) * t,
                     base[2] + hh * t)
            bp.handle_left_type = 'AUTO'
            bp.handle_right_type = 'AUTO'
            bp.radius = 1.0 - 0.7 * t
        ob = bpy.data.objects.new(f"{name}{i}", cu)
        ob.data.materials.append(material)
        bpy.context.scene.collection.objects.link(ob)


# --------------------------------------------------------------------------
# Ambiente
# --------------------------------------------------------------------------
class Room:
    def __init__(self, w=5.0, d=5.0, h=2.75, wall=None, floor=None, ceiling=None,
                 window=None, window_side='left', accent=None, baseboard=True, right_wall=True):
        """Parede do fundo em y=0 (onde fica o aparelho); a sala cresce para -Y."""
        self.w, self.d, self.h = w, d, h
        wall = wall or mat("Wall", (0.74, 0.74, 0.73), 0.92, bump=(220, 0.06))
        ceiling = ceiling or mat("Ceil", (0.82, 0.82, 0.82), 0.95)
        t = 0.2
        back_mat = accent or wall
        rbox("WallBack", (w + 2 * t, t, h), (0, t / 2, h / 2), back_mat, bevel=0)
        rbox("WallFront", (w + 2 * t, t, h), (0, -d - t / 2, h / 2), wall, bevel=0)
        rbox("Ceiling", (w + 2 * t, d + 2 * t, t), (0, -d / 2, h + t / 2), ceiling, bevel=0)
        rbox("Floor", (w + 2 * t, d + 2 * t, t), (0, -d / 2, -t / 2), floor, bevel=0)
        sides = {'left': -1, 'right': 1}
        for side, sgn in sides.items():
            if side == 'right' and not right_wall:
                continue
            x = sgn * (w / 2 + t / 2)
            if window and window_side == side:
                y0, y1, z0, z1 = window  # y0 > y1 (mais perto do fundo primeiro)
                rbox(f"W{side}A", (t, -y0, h), (x, y0 / 2, h / 2), wall, bevel=0)
                rbox(f"W{side}B", (t, d + y1, h), (x, (y1 - d) / 2, h / 2), wall, bevel=0)
                rbox(f"W{side}C", (t, y0 - y1, z0), (x, (y0 + y1) / 2, z0 / 2), wall, bevel=0)
                rbox(f"W{side}D", (t, y0 - y1, h - z1), (x, (y0 + y1) / 2, (h + z1) / 2), wall, bevel=0)
                frame = mat("Frame", (0.015, 0.016, 0.02), 0.4, metal=0.6)
                fx = sgn * (w / 2 + t * 0.55)
                panes = 3
                for i in range(panes + 1):
                    yy = y0 + (y1 - y0) * i / panes
                    rbox(f"Mullion{i}", (0.035, 0.03, z1 - z0), (fx, yy, (z0 + z1) / 2), frame, bevel=0.002)
                rbox("FrameTop", (0.035, y0 - y1, 0.03), (fx, (y0 + y1) / 2, z1 - 0.015), frame, bevel=0.002)
                rbox("FrameBot", (0.035, y0 - y1, 0.03), (fx, (y0 + y1) / 2, z0 + 0.015), frame, bevel=0.002)
            else:
                rbox(f"Wall{side}", (t, d + 2 * t, h), (x, -d / 2, h / 2), wall, bevel=0)
        if baseboard:
            bb = mat("Baseboard", (0.8, 0.8, 0.8), 0.5)
            rbox("BB", (w, 0.014, 0.09), (0, -0.007, 0.045), bb, bevel=0.003)
            rbox("BBL", (0.014, d, 0.09), (-w / 2 + 0.007, -d / 2, 0.045), bb, bevel=0.003)
            rbox("BBR", (0.014, d, 0.09), (w / 2 - 0.007, -d / 2, 0.045), bb, bevel=0.003)


def place_ac(scene, x=0.0, z=2.12, flap=0.6, display="22", strength=4.0, rot_z=0.0, y=0.0):
    parts = ac_model.build_ac(scene.collection, flap_open=flap)
    parts["root"].location = (x, y, z)
    parts["root"].rotation_euler = (0, 0, math.radians(rot_z))
    if display:
        lit_display(parts, display, strength)
    else:
        hide_display(parts)
    return parts


def conduit(x, z_top, z_bottom, material, y=-0.0):
    """Canaleta de acabamento (tubulação embutida) descendo da unidade."""
    rbox("Conduit", (0.075, 0.055, z_top - z_bottom), (x, -0.0275 + y, (z_top + z_bottom) / 2), material, bevel=0.012, seg=5)


def sofa(x, y, fabric, legs, width=2.2, rot=0):
    """Sofá de linhas retas encostado em y (fundo)."""
    depth, seat_h = 0.92, 0.2
    parts = []
    parts.append(rbox("SofaBase", (width, depth, 0.16), (x, y - depth / 2, 0.2), fabric, 0.03, 5))
    n = 3 if width > 1.9 else 2
    cw = (width - 0.36) / n
    for i in range(n):
        cx = x - (width - 0.36) / 2 + cw * (i + 0.5)
        parts.append(rbox(f"Seat{i}", (cw - 0.012, depth - 0.3, seat_h), (cx, y - depth / 2 - 0.11, 0.37), fabric, 0.05, 6))
        parts.append(rbox(f"Back{i}", (cw - 0.012, 0.2, 0.42), (cx, y - 0.16, 0.6), fabric, 0.07, 6, rot=(-9, 0, 0)))
    for sgn in (-1, 1):
        parts.append(rbox("Arm", (0.17, depth, 0.36), (x + sgn * (width / 2 - 0.085), y - depth / 2, 0.42), fabric, 0.045, 6))
        for yy in (y - 0.1, y - depth + 0.1):
            parts.append(cyl("Leg", 0.016, 0.12, (x + sgn * (width / 2 - 0.12), yy, 0.06), legs, 16))
    return parts


def floor_lamp(scene, x, y, metal, glow, power=45, color=(1.0, 0.72, 0.42), height=1.55):
    cyl("LampBase", 0.14, 0.02, (x, y, 0.01), metal, 48, bevel=0.004)
    cyl("LampPole", 0.009, height, (x, y, height / 2), metal, 16)
    sphere("LampGlobe", 0.13, (x, y, height + 0.1), glow)
    common.add_point(scene, (x, y, height + 0.1), power, color, radius=0.13)


def low_table(x, y, top, legs, r=0.42, h=0.34):
    cyl("TableTop", r, 0.03, (x, y, h), top, 64, bevel=0.006)
    for a in (30, 150, 270):
        ax, ay = math.cos(math.radians(a)) * r * 0.62, math.sin(math.radians(a)) * r * 0.62
        cyl("TableLeg", 0.012, h, (x + ax, y + ay, h / 2), legs, 16)


def art(x, z, w, h, frame, canvas, y=-0.012):
    rbox("ArtFrame", (w, 0.024, h), (x, y, z), frame, 0.003)
    rbox("ArtCanvas", (w - 0.05, 0.004, h - 0.05), (x, y - 0.013, z), canvas, 0)


def vase(x, y, z, ceramic, branch, h=0.34, r=0.085, seed=3, count=6, height=0.85):
    cyl("Vase", r, h, (x, y, z + h / 2), ceramic, 48, bevel=0.02)
    branches("Branch", (x, y, z + h * 0.6), branch, count=count, height=height, spread=0.32, seed=seed)


def sky(scene, top=(0.1, 0.22, 0.55), horizon=(0.75, 0.86, 1.0), strength=1.0):
    nt = scene.world.node_tree
    bg = nt.nodes["Background"]
    coord = nt.nodes.new("ShaderNodeTexCoord")
    sep = nt.nodes.new("ShaderNodeSeparateXYZ")
    nt.links.new(coord.outputs["Generated"], sep.inputs[0])
    ramp = nt.nodes.new("ShaderNodeValToRGB")
    ramp.color_ramp.elements[0].position = 0.0
    ramp.color_ramp.elements[0].color = (*horizon, 1)
    ramp.color_ramp.elements[1].position = 0.6
    ramp.color_ramp.elements[1].color = (*top, 1)
    nt.links.new(sep.outputs["Z"], ramp.inputs["Fac"])
    nt.links.new(ramp.outputs["Color"], bg.inputs["Color"])
    bg.inputs["Strength"].default_value = strength


def sun_from(scene, direction, strength, color=(1.0, 0.95, 0.88), angle=1.2):
    s = common.add_sun(scene, (0, 0, 0), strength, color, angle)
    s.rotation_euler = Vector(direction).normalized().to_track_quat('-Z', 'Y').to_euler()
    return s


def interior_camera(scene, loc, target, lens=28, shift_y=0.0, dof=None, fstop=4.0):
    cam = common.add_camera(scene, loc, (target[0], target[1], loc[2]), lens=lens, dof=dof, fstop=fstop)
    cam.data.shift_y = shift_y
    cam.data.clip_start = 0.05
    return cam


def size(w, h):
    return (w // 2, h // 2) if DRAFT else (w, h)


def spp(n):
    return max(24, n // 4) if DRAFT else n


# --------------------------------------------------------------------------
# Cenas — produto (fundo transparente)
# --------------------------------------------------------------------------
def product(name, cam_loc, cam_target, lens, flap, res, display="22"):
    scene = common.reset_scene()
    common.setup_cycles(scene, *size(*res), samples=spp(160), transparent=True, exposure=-0.35)
    common.world_color(scene, (0.02, 0.035, 0.07), 1.0)
    parts = ac_model.build_ac(scene.collection, flap_open=flap)
    parts["root"].location = (0, ac_model.D / 2, -ac_model.H / 2)
    if display:
        lit_display(parts, display, 3.2)
    else:
        hide_display(parts)
    common.add_camera(scene, cam_loc, cam_target, lens=lens)
    common.add_area(scene, (-1.3, -1.7, 1.5), (0, 0, 0), 2.2, 150, (1.0, 1.0, 1.0), name="Key")
    common.add_area(scene, (2.2, -0.4, -0.6), (0, 0, 0), 1.6, 55, (0.45, 0.66, 1.0), name="Fill")
    common.add_area(scene, (0.4, 1.4, 1.1), (0, 0, 0), 2.4, 190, (0.62, 0.8, 1.0), name="Rim")
    common.add_area(scene, (0.0, -0.6, -1.6), (0, 0, 0), 2.0, 26, (0.3, 0.5, 1.0), name="Under")
    common.render(scene, os.path.join(OUT, f"{name}.png"))


def product_hero():
    product("product_hero", (0.86, -1.72, -0.3), (0.0, 0.0, -0.01), 62, 0.7, (2000, 1180))


def product_front():
    product("product_front", (0.0, -2.2, 0.06), (0.0, 0.0, 0.0), 80, 0.0, (2000, 820))


def product_open():
    product("product_open", (-0.7, -1.5, -0.62), (0.0, 0.0, -0.02), 58, 1.0, (1800, 1170))


# --------------------------------------------------------------------------
# Cenas — ambientes
# --------------------------------------------------------------------------
def palette():
    return {
        "wall": mat("WallPlaster", (0.71, 0.72, 0.72), 0.93, bump=(260, 0.05)),
        "navy": mat("WallNavy", (0.028, 0.05, 0.095), 0.9, bump=(260, 0.05)),
        "slate": mat("WallSlate", (0.115, 0.15, 0.2), 0.9, bump=(260, 0.05)),
        "greige": mat("WallGreige", (0.43, 0.44, 0.44), 0.93, bump=(260, 0.05)),
        "oak": wood_floor("FloorOak", (0.36, 0.25, 0.15), (0.3, 0.2, 0.12)),
        "walnut": wood_floor("FloorWalnut", (0.13, 0.085, 0.055), (0.1, 0.065, 0.04), rough=0.32),
        "concrete": concrete("FloorConcrete"),
        "fabric_navy": mat("FabricNavy", (0.016, 0.028, 0.055), 0.96, bump=(900, 0.12)),
        "fabric_light": mat("FabricLight", (0.62, 0.62, 0.6), 0.96, bump=(900, 0.12)),
        "fabric_ice": mat("FabricIce", (0.42, 0.52, 0.62), 0.96, bump=(900, 0.12)),
        "wood": mat("WoodOak", (0.3, 0.2, 0.115), 0.45, bump=(40, 0.03)),
        "wood_dark": mat("WoodDark", (0.05, 0.036, 0.028), 0.4),
        "black": mat("BlackMetal", (0.012, 0.013, 0.016), 0.38, metal=0.8),
        "white": mat("WhiteMatte", (0.82, 0.82, 0.82), 0.6),
        "ceramic": mat("Ceramic", (0.05, 0.07, 0.11), 0.55),
        "ceramic_light": mat("CeramicLight", (0.7, 0.7, 0.68), 0.6),
        "branch": mat("Branch", (0.09, 0.06, 0.04), 0.8),
        "glow_warm": emissive("GlowWarm", (1.0, 0.72, 0.42), 14),
        "canvas_a": mat("CanvasA", (0.02, 0.04, 0.085), 0.9),
        "canvas_b": mat("CanvasB", (0.55, 0.63, 0.7), 0.9),
        "rug": mat("Rug", (0.5, 0.52, 0.54), 1.0, bump=(600, 0.3)),
        "rug_navy": mat("RugNavy", (0.04, 0.065, 0.12), 1.0, bump=(600, 0.3)),
        "sheer": sheer("Sheer"),
        "screen": mat("Screen", (0.01, 0.012, 0.016), 0.12),
        "steel": mat("Steel", (0.55, 0.57, 0.6), 0.3, metal=1.0),
    }


def sala():
    """Sala de estar, luz do dia — composição frontal."""
    scene = common.reset_scene()
    common.setup_cycles(scene, *size(1800, 1125), samples=spp(200), exposure=0.0)
    P = palette()
    Room(w=5.4, d=5.2, h=2.8, wall=P["wall"], floor=P["oak"], window=(-0.9, -3.6, 0.25, 2.5), window_side='left')
    sky(scene, strength=1.1)
    sun_from(scene, (0.8, 1.0, -0.42), 9.0, color=(1.0, 0.9, 0.76))
    common.add_area(scene, (-2.9, -2.25, 1.4), (0, -2.25, 1.2), 2.4, 70, (0.7, 0.84, 1.0), size_y=2.0, name="Portal")
    place_ac(scene, x=0.55, z=2.2, flap=0.65)
    sofa(0.55, -0.12, P["fabric_navy"], P["black"], width=2.5)
    rbox("Pillow1", (0.44, 0.14, 0.4), (-0.28, -0.4, 0.66), P["fabric_ice"], 0.06, 6, rot=(-16, 0, 8))
    rbox("Pillow2", (0.42, 0.14, 0.38), (1.42, -0.4, 0.65), P["fabric_light"], 0.06, 6, rot=(-16, 0, -6))
    rbox("Rug", (3.0, 2.1, 0.012), (0.55, -1.75, 0.006), P["rug"], 0.004)
    low_table(0.5, -1.65, P["wood_dark"], P["black"], r=0.46)
    cyl("Bowl", 0.11, 0.05, (0.42, -1.6, 0.38), P["ceramic_light"], 48, bevel=0.01)
    floor_lamp(scene, -1.55, -0.42, P["black"], P["glow_warm"], power=30)
    art(-1.3, 1.55, 0.72, 0.95, P["black"], P["canvas_a"])
    vase(2.25, -0.4, 0.0, P["ceramic"], P["branch"], h=0.5, r=0.11, seed=5, height=1.05)
    interior_camera(scene, (0.2, -4.75, 1.3), (0.2, 0, 1.3), lens=30, shift_y=0.075)
    common.render(scene, os.path.join(OUT, "sala.png"))


def quarto():
    """Quarto ao entardecer — azul da janela + luz quente de cabeceira."""
    scene = common.reset_scene()
    common.setup_cycles(scene, *size(1280, 1600), samples=spp(220), exposure=1.05)
    P = palette()
    Room(w=4.2, d=4.6, h=2.7, wall=P["wall"], floor=P["walnut"], accent=P["navy"],
         window=(-0.7, -2.9, 0.5, 2.4), window_side='right')
    sky(scene, top=(0.02, 0.05, 0.2), horizon=(0.12, 0.22, 0.5), strength=1.3)
    common.add_area(scene, (2.25, -1.8, 1.45), (0, -1.8, 1.0), 2.0, 60, (0.35, 0.55, 1.0), size_y=1.8, name="Portal")
    place_ac(scene, x=-0.35, z=2.1, flap=0.5, strength=5.0)
    # cama
    rbox("BedBase", (1.75, 2.1, 0.22), (-0.35, -1.12, 0.17), P["wood_dark"], 0.012)
    rbox("Mattress", (1.68, 2.02, 0.2), (-0.35, -1.1, 0.38), P["white"], 0.06, 6)
    rbox("Duvet", (1.76, 1.45, 0.16), (-0.35, -1.42, 0.5), P["fabric_ice"], 0.07, 7)
    rbox("DuvetFold", (1.76, 0.3, 0.06), (-0.35, -0.82, 0.57), P["fabric_light"], 0.028, 5)
    for i, px in enumerate((-0.78, 0.08)):
        rbox(f"PillowB{i}", (0.7, 0.42, 0.16), (px, -0.36, 0.56), P["white"], 0.07, 7, rot=(8, 0, 0))
    rbox("Headboard", (2.5, 0.07, 1.05), (-0.35, -0.04, 0.62), P["fabric_navy"], 0.025, 5)
    # criado-mudo + luminária
    rbox("Night", (0.46, 0.4, 0.42), (-1.5, -0.24, 0.21), P["wood"], 0.01)
    cyl("LampStem", 0.012, 0.22, (-1.5, -0.22, 0.53), P["black"], 16)
    sphere("LampOrb", 0.085, (-1.5, -0.22, 0.7), P["glow_warm"])
    common.add_point(scene, (-1.5, -0.22, 0.7), 30, (1.0, 0.66, 0.36), radius=0.085)
    rbox("Night2", (0.46, 0.4, 0.42), (0.8, -0.24, 0.21), P["wood"], 0.01)
    vase(0.8, -0.24, 0.42, P["ceramic_light"], P["branch"], h=0.2, r=0.06, seed=9, count=4, height=0.5)
    rbox("RugB", (2.6, 1.6, 0.012), (-0.35, -2.5, 0.006), P["rug"], 0.004)
    curtain("CurtainB", 2.02, -0.55, -1.15, 0.02, 2.62, P["sheer"], folds=6)
    interior_camera(scene, (-1.0, -4.25, 1.42), (-0.35, 0, 1.42), lens=30, shift_y=-0.02)
    scene.camera.rotation_euler[2] += math.radians(-5)
    common.render(scene, os.path.join(OUT, "quarto.png"))


def escritorio():
    """Home office / escritório — luz fria difusa."""
    scene = common.reset_scene()
    common.setup_cycles(scene, *size(1800, 1200), samples=spp(200), exposure=-0.25)
    P = palette()
    Room(w=4.6, d=4.4, h=2.7, wall=P["greige"], floor=P["concrete"], window=(-0.6, -3.2, 0.5, 2.45), window_side='left')
    sky(scene, top=(0.3, 0.45, 0.8), horizon=(0.8, 0.88, 1.0), strength=1.0)
    sun_from(scene, (0.85, 1.0, -0.5), 8.0, color=(1.0, 0.92, 0.8))
    common.add_area(scene, (-2.5, -1.9, 1.6), (0, -1.9, 1.2), 2.4, 60, (0.75, 0.86, 1.0), size_y=1.5, name="Portal")
    place_ac(scene, x=-0.3, z=2.08, flap=0.6)
    conduit(0.24, 2.09, 0.09, P["white"])
    # mesa
    rbox("DeskTop", (1.9, 0.78, 0.035), (-0.3, -0.62, 0.74), P["wood"], 0.006)
    for sx in (-1, 1):
        rbox("DeskLeg", (0.035, 0.7, 0.72), (-0.3 + sx * 0.88, -0.62, 0.36), P["black"], 0.004)
    rbox("Monitor", (0.78, 0.022, 0.46), (-0.42, -0.42, 1.12), P["screen"], 0.006)
    rbox("MonitorNeck", (0.05, 0.03, 0.2), (-0.42, -0.4, 0.86), P["black"], 0.004)
    rbox("MonitorFoot", (0.26, 0.18, 0.012), (-0.42, -0.42, 0.764), P["black"], 0.004)
    rbox("Laptop", (0.34, 0.24, 0.014), (0.28, -0.7, 0.765), P["steel"], 0.004)
    rbox("Notebook", (0.2, 0.28, 0.018), (-1.0, -0.72, 0.766), P["canvas_a"], 0.003, rot=(0, 0, 12))
    cyl("Cup", 0.04, 0.09, (0.62, -0.52, 0.8), P["ceramic_light"], 32, bevel=0.006)
    # cadeira (encosto simples)
    rbox("ChairSeat", (0.5, 0.5, 0.07), (-0.3, -1.42, 0.47), P["fabric_navy"], 0.03, 5)
    rbox("ChairBack", (0.48, 0.06, 0.5), (-0.3, -1.67, 0.8), P["fabric_navy"], 0.03, 5, rot=(6, 0, 0))
    cyl("ChairStem", 0.025, 0.4, (-0.3, -1.42, 0.24), P["black"], 16)
    cyl("ChairBase", 0.27, 0.025, (-0.3, -1.42, 0.02), P["black"], 5)
    # prateleiras
    for i, z in enumerate((1.25, 1.65)):
        rbox(f"Shelf{i}", (1.1, 0.24, 0.03), (1.55, -0.12, z), P["wood"], 0.004)
    rnd = random.Random(4)
    x = 1.1
    for i in range(7):
        bw = rnd.uniform(0.03, 0.055)
        bh = rnd.uniform(0.2, 0.28)
        col = rnd.choice([P["canvas_a"], P["canvas_b"], P["white"], P["ceramic"]])
        rbox(f"Book{i}", (bw, 0.17, bh), (x + bw / 2, -0.12, 1.265 + bh / 2), col, 0.002)
        x += bw + 0.004
    vase(1.85, -0.12, 1.665, P["ceramic"], P["branch"], h=0.18, r=0.055, seed=2, count=4, height=0.42)
    rbox("Box", (0.3, 0.2, 0.14), (1.3, -0.12, 1.735), P["fabric_light"], 0.008)
    art(-1.75, 1.5, 0.55, 0.75, P["black"], P["canvas_b"])
    interior_camera(scene, (1.15, -4.1, 1.38), (0.1, 0, 1.38), lens=30, shift_y=0.03)
    scene.camera.rotation_euler[2] += math.radians(11)
    common.render(scene, os.path.join(OUT, "escritorio.png"))


def comercial():
    """Ambiente comercial — recepção / loja, clima noturno."""
    scene = common.reset_scene()
    common.setup_cycles(scene, *size(1920, 960), samples=spp(220), exposure=0.25)
    P = palette()
    Room(w=9.0, d=6.0, h=3.2, wall=P["wall"], floor=P["concrete"], accent=P["navy"], baseboard=False)
    common.world_color(scene, (0.01, 0.015, 0.03), 0.4)
    for x in (-2.3, 2.3):
        place_ac(scene, x=x, z=2.55, flap=0.6, strength=6.0)
    # balcão
    rbox("Counter", (3.6, 0.75, 1.02), (0.0, -1.35, 0.51), P["wood_dark"], 0.012)
    rbox("CounterTop", (3.7, 0.82, 0.04), (0.0, -1.35, 1.04), P["white"], 0.008)
    rbox("Plinth", (3.5, 0.7, 0.08), (0.0, -1.35, 0.04), P["black"], 0.004)
    # pendentes
    for i, x in enumerate((-1.1, 0.0, 1.1)):
        cyl(f"Cord{i}", 0.004, 1.15, (x, -1.35, 3.2 - 0.575), P["black"], 8)
        cyl(f"Shade{i}", 0.13, 0.2, (x, -1.35, 2.0), P["black"], 48, bevel=0.01)
        cyl(f"Bulb{i}", 0.1, 0.01, (x, -1.35, 1.895), P["glow_warm"], 32)
        common.add_point(scene, (x, -1.35, 1.82), 70, (1.0, 0.7, 0.4), radius=0.06)
    # nicho iluminado no fundo
    rbox("NicheShelf1", (2.6, 0.26, 0.035), (0.0, -0.13, 1.5), P["wood_dark"], 0.004)
    rbox("NicheShelf2", (2.6, 0.26, 0.035), (0.0, -0.13, 1.95), P["wood_dark"], 0.004)
    rnd = random.Random(8)
    for sh, z in enumerate((1.52, 1.97)):
        x = -1.15
        while x < 1.1:
            r = rnd.uniform(0.04, 0.07)
            h = rnd.uniform(0.12, 0.3)
            cyl(f"Obj{sh}{x:.2f}", r, h, (x, -0.13, z + h / 2), rnd.choice([P["ceramic"], P["ceramic_light"], P["steel"]]), 32, bevel=0.008)
            x += rnd.uniform(0.3, 0.55)
    common.add_area(scene, (0, -0.25, 2.42), (0, -0.1, 1.5), 2.4, 16, (1.0, 0.8, 0.55), size_y=0.05, name="Niche")
    # poltronas de espera
    for i, x in enumerate((-3.35, 3.35)):
        rbox(f"Lounge{i}", (0.85, 0.8, 0.3), (x, -1.0, 0.28), P["fabric_ice"], 0.06, 6)
        rbox(f"LoungeB{i}", (0.85, 0.2, 0.5), (x, -0.66, 0.55), P["fabric_ice"], 0.06, 6, rot=(-8, 0, 0))
        low_table(x - (0.95 if x > 0 else -0.95), -1.25, P["black"], P["black"], r=0.24, h=0.42)
    vase(4.0, -0.5, 0.0, P["ceramic"], P["branch"], h=0.62, r=0.14, seed=11, count=7, height=1.3)
    # iluminação ambiente fria (luminária de teto linear)
    common.add_area(scene, (0, -3.2, 3.15), (0, -3.2, 0), 5.0, 60, (0.6, 0.78, 1.0), size_y=0.25, name="Linear")
    common.add_area(scene, (0, -0.9, 3.15), (0, -0.2, 2.2), 8.0, 22, (0.5, 0.7, 1.0), size_y=0.12, name="Wash")
    interior_camera(scene, (0.6, -5.75, 1.45), (0.2, 0, 1.45), lens=24, shift_y=0.06)
    common.render(scene, os.path.join(OUT, "comercial.png"))


def detalhe_display():
    """Close do painel com o display aceso — luz rasante, profundidade de campo."""
    scene = common.reset_scene()
    common.setup_cycles(scene, *size(1400, 1400), samples=spp(180), exposure=0.2)
    P = palette()
    wall = mat("WallDetail", (0.06, 0.09, 0.15), 0.9, bump=(180, 0.12))
    rbox("Wall", (4, 0.2, 3), (0, 0.1, 0.2), wall, bevel=0)
    common.world_color(scene, (0.01, 0.02, 0.05), 1.0)
    parts = ac_model.build_ac(scene.collection, flap_open=0.0)
    lit_display(parts, "22", 7.0)
    common.add_area(scene, (-1.6, -0.5, 1.0), (0.2, -0.1, 0.15), 1.4, 120, (0.75, 0.87, 1.0), name="Rake")
    common.add_area(scene, (1.3, -1.4, -0.5), (0.25, 0, 0.15), 1.0, 22, (0.4, 0.6, 1.0), name="Fill")
    cam = common.add_camera(scene, (0.78, -0.62, 0.06), (0.3, -0.2, 0.165), lens=58, dof=0.66, fstop=2.2)
    _ = (P, cam)
    common.render(scene, os.path.join(OUT, "detalhe_display.png"))


def detalhe_acabamento():
    """Vista de baixo: aleta aberta, canaleta alinhada — acabamento da instalação."""
    scene = common.reset_scene()
    common.setup_cycles(scene, *size(1280, 1600), samples=spp(200), exposure=-0.3)
    P = palette()
    Room(w=3.6, d=3.6, h=2.7, wall=P["wall"], floor=P["oak"], accent=P["slate"], window=(-0.5, -2.6, 0.3, 2.5), window_side='left')
    sky(scene, strength=1.0)
    sun_from(scene, (1.0, 0.75, -0.4), 7.0, color=(1.0, 0.9, 0.78))
    common.add_area(scene, (-2.0, -1.5, 1.5), (0, -1.5, 1.4), 2.0, 45, (0.75, 0.86, 1.0), size_y=2.0, name="Portal")
    place_ac(scene, x=0.15, z=2.06, flap=0.85, strength=5.0)
    conduit(0.69, 2.07, 0.09, P["white"])
    art(-0.85, 1.35, 0.5, 0.66, P["black"], P["canvas_a"])
    cam = common.add_camera(scene, (-0.42, -1.85, 1.02), (0.22, -0.08, 1.98), lens=34, dof=1.9, fstop=2.8)
    _ = cam
    common.render(scene, os.path.join(OUT, "detalhe_acabamento.png"))


def reuniao():
    """Sala de reunião — mesa longa, parede azul, luz linear."""
    scene = common.reset_scene()
    common.setup_cycles(scene, *size(1800, 1200), samples=spp(220), exposure=0.4)
    P = palette()
    Room(w=5.6, d=6.4, h=2.9, wall=P["wall"], floor=P["walnut"], accent=P["navy"],
         window=(-0.8, -5.4, 0.2, 2.6), window_side='left')
    sky(scene, top=(0.06, 0.14, 0.42), horizon=(0.42, 0.56, 0.85), strength=1.5)
    common.add_area(scene, (-3.0, -3.1, 1.5), (0, -3.1, 1.2), 4.4, 300, (0.62, 0.78, 1.0), size_y=2.2, name="Portal")
    place_ac(scene, x=0.0, z=2.25, flap=0.6, strength=5.0)
    rbox("Table", (1.25, 3.4, 0.045), (0.0, -2.9, 0.74), P["wood_dark"], 0.008)
    for yy in (-1.6, -4.2):
        rbox("TLeg", (0.9, 0.06, 0.72), (0.0, yy, 0.36), P["black"], 0.004)
    for i in range(4):
        y = -1.7 - i * 0.8
        for sgn in (-1, 1):
            x = sgn * 1.0
            rbox(f"CSeat{i}{sgn}", (0.46, 0.46, 0.06), (x, y, 0.47), P["fabric_ice"], 0.025, 5)
            rbox(f"CBack{i}{sgn}", (0.05, 0.44, 0.42), (x + sgn * 0.22, y, 0.74), P["fabric_ice"], 0.022, 5)
            cyl(f"CStem{i}{sgn}", 0.02, 0.44, (x, y, 0.22), P["black"], 12)
            cyl(f"CBase{i}{sgn}", 0.22, 0.02, (x, y, 0.012), P["black"], 5)
    # luminária linear pendente
    rbox("Linear", (0.06, 2.8, 0.05), (0.0, -2.9, 2.0), P["black"], 0.004)
    rbox("LinearGlow", (0.045, 2.76, 0.006), (0.0, -2.9, 1.972), P["glow_warm"], 0)
    common.add_area(scene, (0, -2.9, 1.96), (0, -2.9, 0), 0.05, 70, (1.0, 0.8, 0.58), size_y=2.7, name="LinearL")
    for yy in (-1.7, -4.1):
        cyl("LCord", 0.003, 0.9, (0, yy, 2.45), P["black"], 8)
    rbox("Screen", (1.5, 0.03, 0.86), (0.0, -0.03, 1.38), P["screen"], 0.006)
    vase(2.35, -0.45, 0.0, P["ceramic"], P["branch"], h=0.55, r=0.12, seed=21, count=6, height=1.15)
    curtain("CurtainR", -2.72, -0.7, -1.5, 0.02, 2.8, P["sheer"], folds=7)
    interior_camera(scene, (0.9, -6.1, 1.4), (0.0, 0, 1.4), lens=26, shift_y=0.04)
    scene.camera.rotation_euler[2] += math.radians(5)
    common.render(scene, os.path.join(OUT, "reuniao.png"))


SCENES = {
    "product_hero": product_hero,
    "product_front": product_front,
    "product_open": product_open,
    "sala": sala,
    "quarto": quarto,
    "escritorio": escritorio,
    "comercial": comercial,
    "detalhe_display": detalhe_display,
    "detalhe_acabamento": detalhe_acabamento,
    "reuniao": reuniao,
}

if __name__ == "__main__":
    os.makedirs(OUT, exist_ok=True)
    for key, fn in SCENES.items():
        if ONLY and key not in ONLY:
            continue
        print(">>", key, flush=True)
        fn()
    print("done")
