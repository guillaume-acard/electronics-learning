"""SVG drawing helpers for the component "types you'll meet" cards (pages/components/*/types.py)."""
def S(inner,w=140,h=70): return f'<svg viewBox="0 0 {w} {h}" aria-hidden="true">{inner}</svg>'
LEG='#cbd5e1'
def legs_h(y=35,x1=4,x2=136): return f'<path d="M{x1} {y}H{x2}" stroke="{LEG}" stroke-width="2.5"/>'
def axial(body,bands,w=56,h=18,stripe=None,rx=8):
    x=70-w/2;y=35-h/2;s=legs_h()+f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}" fill="{body}" stroke="#64748b" stroke-width="1"/>'
    for i,c in enumerate(bands): s+=f'<rect x="{x+9+i*8}" y="{y}" width="4" height="{h}" fill="{c}"/>'
    if stripe: s+=f'<rect x="{x+w-12}" y="{y}" width="5" height="{h}" fill="{stripe}"/>'
    return S(s)
def radial(body,w,h,top=None,label='',stripe=None,lc='#fff'):
    x=70-w/2;y=50-h;s=f'<path d="M{70-8} 50V68M{70+8} 50V68" stroke="{LEG}" stroke-width="2.5"/><rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{min(w,h)/5}" fill="{body}"/>'
    if stripe: s+=f'<rect x="{x+w-9}" y="{y}" width="7" height="{h}" fill="{stripe}"/><text x="{x+w-5.5}" y="{y+h/2+4}" text-anchor="middle" font-size="10" fill="#0b1220" font-weight="800">−</text>'
    if label: s+=f'<text x="70" y="{y+h/2+4}" text-anchor="middle" font-size="10" font-weight="700" fill="{lc}" font-family="system-ui">{label}</text>'
    return S(s)
def to92(lab,body='#111827',n=3):
    s=''.join(f'<path d="M{58+i*12 if n==3 else 62+i*16} 48V68" stroke="{LEG}" stroke-width="2.5"/>' for i in range(n))
    return S(s+f'<path d="M48 48V28a22 22 0 0 1 44 0V48z" fill="{body}"/><text x="70" y="40" text-anchor="middle" font-size="9" font-weight="700" fill="#cbd5e1" font-family="system-ui">{lab}</text>')
def to220(lab,tab='#94a3b8'):
    return S(f'<rect x="48" y="2" width="44" height="22" rx="2" fill="{tab}"/><circle cx="70" cy="12" r="5" fill="#0b1220"/><rect x="48" y="22" width="44" height="28" fill="#1f2937" stroke="#64748b" stroke-width="1"/><text x="70" y="40" text-anchor="middle" font-size="8.5" font-weight="700" fill="#cbd5e1" font-family="system-ui">{lab}</text><path d="M58 50V68M70 50V68M82 50V68" stroke="{LEG}" stroke-width="3"/>')
def led(col,legs=2,x=70,size=1,flat=True,extra=''):
    s=''.join(f'<path d="M{x-6+i*(12/(legs-1) if legs>1 else 0)} 46V{68 if i else 62}" stroke="{LEG}" stroke-width="2"/>' for i in range(legs))
    r=11*size;return S(s+f'<rect x="{x-r-2}" y="44" width="{2*r+4}" height="5" rx="1" fill="{col}" opacity=".85"/><path d="M{x-r} 45V{45-r}a{r} {r} 0 0 1 {2*r} 0V45z" fill="{col}" opacity=".9"/>'+extra)
