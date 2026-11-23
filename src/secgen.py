def SEC(id,n,title,tag,intro,ctrl,canvas,hint,need,how,steps,var,power='battery'):
    return f'''
<section id="{id}">
  <h2><span class="num">{n}</span>{title}</h2>
  <p><span class="qtopic">{tag}</span> {intro}</p>
  <div class="controls">{ctrl}</div>
  <canvas id="{canvas}" width="800" height="300"></canvas>
  <p class="hint">{hint}</p>
  <div style="margin-top:12px"><h3 style="margin-top:0">🧰 You need</h3><ul>{''.join(f'<li>{x}</li>' for x in need)}</ul></div>
  <h3>💡 How it works</h3>
  <div class="howbox">{''.join(f'<p>{p}</p>' for p in how)}</div>
  <h3>🏁 Final breadboard setup</h3>
  <p class="hint" style="margin-top:-6px">This is what your board should look like when it's finished (and powered). Compare with it at the end.</p>
  <canvas id="bbF_{id}" class="bbc" width="800" height="440"></canvas>
  <h3 class="wtitle">🔌 Step-by-step wiring <span class="wprog"></span> <button class="wreset">↺ reset</button></h3>
  <p class="hint" style="margin-top:-6px">Follow the steps in order and tick each one. Wire with the battery <b>disconnected</b>, and connect it <b>last</b>. Column and hole numbers (a–j) follow the <a class="navlink" href="#cintro">breadboard map</a>.</p>
  <div class="bblive"><div class="bbcap">🧩 Your breadboard so far: parts appear as you tick the steps, and the <span style="color:#f59e0b">glowing outline</span> shows where the next step goes.</div><canvas id="bbS_{id}" class="bbc" width="800" height="440"></canvas></div>
  <ol class="wsteps">{''.join(f'<li><label><input type="checkbox"><span>{t}</span></label></li>' for t in steps)}</ol>
  <h3>🧪 Variants to try</h3>
  <table>{''.join(f'<tr><td>{a}</td><td>{b}</td></tr>' for a,b in var)}</table>
</section>'''
