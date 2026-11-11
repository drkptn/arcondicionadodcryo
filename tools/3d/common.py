"""Utilitários compartilhados pelos scripts de render (Cycles / CPU)."""

import math
import os

import bpy
from mathutils import Vector


def reset_scene():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    scene = bpy.context.scene
    scene.world = bpy.data.worlds.new("World")
    scene.world.use_nodes = True
    return scene


def setup_cycles(scene, w, h, samples=96, transparent=False, bounces=6, exposure=0.0, look="AgX - Medium High Contrast"):
    scene.render.engine = 'CYCLES'
    scene.cycles.device = 'CPU'
    scene.cycles.samples = samples
    scene.cycles.use_adaptive_sampling = True
    scene.cycles.adaptive_threshold = 0.02
    scene.cycles.use_denoising = True
    limit = float(os.environ.get('RENDER_TIME_LIMIT', '0'))
    if limit > 0:
        scene.cycles.time_limit = limit
    try:
        scene.cycles.denoiser = 'OPENIMAGEDENOISE'
    except Exception:
        pass
    scene.cycles.max_bounces = bounces
    scene.cycles.diffuse_bounces = min(bounces, 4)
    scene.cycles.glossy_bounces = min(bounces, 4)
    scene.cycles.transmission_bounces = 6
    scene.cycles.caustics_reflective = False
    scene.cycles.caustics_refractive = False
    threads = int(os.environ.get('RENDER_THREADS', '0'))
    if threads > 0:
        scene.render.threads_mode = 'FIXED'
        scene.render.threads = threads
    else:
        scene.render.threads_mode = 'AUTO'
    scene.render.resolution_x = w
    scene.render.resolution_y = h
    scene.render.resolution_percentage = 100
    scene.render.film_transparent = transparent
    scene.render.image_settings.file_format = 'PNG'
    scene.render.image_settings.color_mode = 'RGBA' if transparent else 'RGB'
    scene.render.image_settings.color_depth = '8'
    scene.view_settings.view_transform = 'AgX'
    try:
        scene.view_settings.look = look
    except Exception:
        pass
    scene.view_settings.exposure = exposure


def world_color(scene, color, strength=1.0):
    bg = scene.world.node_tree.nodes.get("Background")
    bg.inputs[0].default_value = (*color, 1.0)
    bg.inputs[1].default_value = strength


def look_at(ob, target):
    direction = Vector(target) - ob.location
    ob.rotation_euler = direction.to_track_quat('-Z', 'Y').to_euler()


def add_camera(scene, loc, target, lens=50, dof=None, fstop=2.8, sensor=36):
    cam_data = bpy.data.cameras.new("Cam")
    cam_data.lens = lens
    cam_data.sensor_width = sensor
    cam = bpy.data.objects.new("Cam", cam_data)
    cam.location = loc
    scene.collection.objects.link(cam)
    look_at(cam, target)
    if dof is not None:
        cam_data.dof.use_dof = True
        cam_data.dof.focus_distance = dof
        cam_data.dof.aperture_fstop = fstop
    scene.camera = cam
    return cam


def add_area(scene, loc, target, size, power, color=(1, 1, 1), size_y=None, name="Area"):
    data = bpy.data.lights.new(name, 'AREA')
    data.energy = power
    data.color = color
    if size_y:
        data.shape = 'RECTANGLE'
        data.size = size
        data.size_y = size_y
    else:
        data.size = size
    ob = bpy.data.objects.new(name, data)
    ob.location = loc
    scene.collection.objects.link(ob)
    look_at(ob, target)
    return ob


def add_sun(scene, rot_deg, strength, color=(1, 1, 1), angle=1.5):
    data = bpy.data.lights.new("Sun", 'SUN')
    data.energy = strength
    data.color = color
    data.angle = math.radians(angle)
    ob = bpy.data.objects.new("Sun", data)
    ob.rotation_euler = tuple(math.radians(a) for a in rot_deg)
    scene.collection.objects.link(ob)
    return ob


def add_point(scene, loc, power, color=(1, 1, 1), radius=0.05):
    data = bpy.data.lights.new("Point", 'POINT')
    data.energy = power
    data.color = color
    data.shadow_soft_size = radius
    ob = bpy.data.objects.new("Point", data)
    ob.location = loc
    scene.collection.objects.link(ob)
    return ob


def render(scene, path):
    scene.render.filepath = path
    bpy.ops.render.render(write_still=True)
