"""Preview rápido do modelo (uso interno durante a modelagem)."""
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import ac_model  # noqa: E402
import common  # noqa: E402

out = sys.argv[sys.argv.index("--") + 1] if "--" in sys.argv else "/tmp/preview"
flap = float(os.environ.get("FLAP", "0"))

views = {
    "front34": ((0.95, -1.75, -0.2), (0.0, -0.08, 0.14), 55),
    "low": ((-0.85, -1.45, -0.55), (0.0, -0.08, 0.13), 50),
    "top": ((0.7, -1.2, 0.95), (0.0, -0.08, 0.14), 50),
    "side": ((1.5, -0.25, 0.12), (0.0, -0.1, 0.14), 70),
}
only = os.environ.get("VIEWS")
for name, (loc, target, lens) in views.items():
    if only and name not in only.split(","):
        continue
    scene = common.reset_scene()
    common.setup_cycles(scene, 1100, 620, samples=40, transparent=False)
    common.world_color(scene, (0.02, 0.03, 0.06), 1.0)
    ac_model.build_ac(scene.collection, flap_open=flap)
    common.add_camera(scene, loc, target, lens=lens)
    common.add_area(scene, (1.2, -1.6, 1.4), (0, 0, 0.15), 1.6, 110, (0.95, 0.97, 1.0))
    common.add_area(scene, (-1.8, -0.9, 0.2), (0, 0, 0.15), 1.2, 60, (0.6, 0.75, 1.0))
    common.add_area(scene, (0.0, 0.9, 0.9), (0, 0, 0.15), 1.5, 120, (0.7, 0.85, 1.0))
    common.render(scene, os.path.join(out, f"{name}.png"))
print("done")
