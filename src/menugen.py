NM={'p1':'LED brightness','p2':'LED fade','p3':'Polarity tester','p4':'Traffic light','p5':'Touch switch','p6':'Coil kick','p7':'Relay clicker','p16':'LED flip-flop',
 'p8':'555 blinker','p9':'LED chaser','p10':'Mini amp','p11':'Buzzer','p17':'Police siren','p18':'Fuzz pedal','p12':'Digital dice (Arduino)','p13':'Dice: LED dots','p14':'Dice: 7-seg matrix',
 'p15':'Dice: 7-seg decoder','p19':'Counter 00–99','p20':'Thermometer','p21':'Bar thermometer','p22':'IR beam alarm','p23':'Motor speed (PWM)','p24':'Motor forward/reverse','p25':'Lower the voltage','p26':'Quartz stopwatch','rl1':'Battery charger','rl2':'Night light'}
TH=[('💡 LEDs & basics',['p1','p2','p3','p4']),('🔀 Transistors & relays',['p5','p6','p7','p16']),('⏱️ Timers & blinkers',['p8','p9','p26']),
 ('🔊 Sound & music',['p11','p17','p10','p18']),('🎲 Dice & counters',['p12','p13','p14','p15','p19']),('🌡️ Sensors & detectors',['p20','p21','p22']),('⚙️ Motors',['p23','p24','p25']),('🏠 Real-life builds',['rl1','rl2'])]
num=lambda k:{'rl1':'A','rl2':'B'}.get(k,k[1:])
menu='<aside class="cl-menu" id="clMenu"><h4>Start</h4><a href="#cintro" data-cl="cintro"><span class="n">★</span>How to use this page</a>'+''.join(
 f'<h4>{t}</h4>'+''.join(f'<a href="#{k}" data-cl="{k}"><span class="n">{num(k)}</span>{NM[k]}</a>' for k in ks) for t,ks in TH)+'<h4>Parts</h4><a href="shopping.html"><span class="n">🛍️</span>Shopping list</a></aside>'
s=re.sub(r'<aside class="cl-menu" id="clMenu">.*?</aside>',menu,s,count=1,flags=re.S)
tab='<table>\n'+''.join(f'    <tr><td>{t}</td><td>'+' · '.join(f'<a class="navlink" href="#{k}">{num(k)} {NM[k]}</a>' for k in ks)+'</td></tr>\n' for t,ks in TH)+'  </table>'
a=s.index('<table>',s.index('<section id="cintro">'));b=s.index('</table>',a)+8;s=s[:a]+tab+s[b:]
