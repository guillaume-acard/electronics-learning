"""Components of the circuits page. One template renders every project from its data file (projects/<id>.py);
themes.py gives the menu groups and the order. Add a project: write projects/pNN.py (+ projects/pNN.js for its
breadboard layout and demo) and add its id to themes.py."""
import importlib.util, os
from components import tag
from themes import THEMES

HERE = os.path.dirname(os.path.abspath(__file__))
DEFAULT_WIRING = 'Follow the steps in order and tick each one. Always wire with the power <b>disconnected</b>, and connect the battery or USB <b>last</b>.'


def project(pid):
    spec = importlib.util.spec_from_file_location('project_' + pid, os.path.join(HERE, 'projects', pid + '.py'))
    m = importlib.util.module_from_spec(spec); spec.loader.exec_module(m)
    return m


def projects():
    """[(theme, [project module, ...]), ...] in menu order."""
    return [(theme, [project(i) for i in ids]) for theme, ids in THEMES]


def section(p, group=None):
    g = f' data-group="{group}"' if group else ''
    need = ''.join(f'<li>{x}</li>' for x in p.NEED)
    how = ''.join(f'<p>{x}</p>' for x in p.HOW)
    steps = ''.join(f'<li><label><input type="checkbox"><span>{x}</span></label></li>' for x in p.STEPS)
    variants = ''.join(f'<tr><td>{a}</td><td>{b}</td></tr>' for a, b in p.VARIANTS)
    return f'''
<section id="{p.ID}" data-menu="{p.MENU}" data-icon="{p.NUM}"{g}>
  <h2><span class="num">{p.NUM}</span>{p.TITLE}</h2>
  {p.TOP}
  <div class="mt-s"><h3 class="flush">🧰 You need</h3><ul>{need}</ul></div>
  <h3>💡 How it works</h3>
  <div class="howbox">{how}</div>
  {p.EXTRA}
  <h3>🏁 Final breadboard setup</h3>
  <p class="hint sub">This is what your board should look like when it's finished (and powered). Compare with it at the end.</p>
  <canvas id="bbF_{p.ID}" class="bbc" width="800" height="440"></canvas>
  <h3 class="wtitle">🔌 Step-by-step wiring <span class="wprog"></span> <button class="wreset">↺ reset</button></h3>
  <p class="hint sub">{p.WIRING or DEFAULT_WIRING} Column and hole numbers (a–j) follow the <a class="navlink" href="#cintro">breadboard map</a>.</p>
  <div class="bblive"><div class="bbcap">🧩 Your breadboard so far: parts appear as you tick the steps, and the <span class="amber">glowing outline</span> shows where the next step goes.</div><canvas id="bbS_{p.ID}" class="bbc" width="800" height="440"></canvas></div>
  <ol class="wsteps">{steps}</ol>
  <h3>🧪 Variants to try</h3>
  <table>{variants}</table>
  {p.AFTER}
</section>'''


@tag('circuits')
def _circuits(a, inner, ctx):
    """<x-circuits/>: every project, grouped by theme (themes.py)."""
    return ''.join(section(p, theme if i == 0 else None) for theme, ps in projects() for i, p in enumerate(ps))


@tag('circuits-table')
def _table(a, inner, ctx):
    """<x-circuits-table/>: the themes table of the intro, with a link to each project."""
    rows = ''.join(f'    <tr><td>{theme}</td><td>' + ' · '.join(f'<a class="navlink" href="#{p.ID}">{p.NUM} {p.MENU}</a>' for p in ps) + '</td></tr>\n'
                   for theme, ps in projects())
    return '<table>\n' + rows + '  </table>'
