"""Exporta o modelo do split para public/models/split.glb.

Uso:  python tools/3d/build_glb.py   (Python com o módulo `bpy` instalado: pip install bpy)
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)

import bpy  # noqa: E402

import ac_model  # noqa: E402
import common  # noqa: E402

out = os.path.abspath(os.path.join(HERE, "..", "..", "public", "models", "split.glb"))
os.makedirs(os.path.dirname(out), exist_ok=True)

scene = common.reset_scene()
parts = ac_model.build_ac(scene.collection, name="Split", flap_open=0.0)
# centraliza o conjunto na origem para girar em torno do próprio centro
parts["root"].location = (0.0, ac_model.D / 2, -ac_model.H / 2)

bpy.ops.export_scene.gltf(
    filepath=out,
    export_format='GLB',
    export_yup=True,
    export_apply=True,
    export_texcoords=True,
    export_normals=True,
    export_materials='EXPORT',
    export_cameras=False,
    export_lights=False,
    export_animations=False,
)
print("GLB:", out, os.path.getsize(out), "bytes")
