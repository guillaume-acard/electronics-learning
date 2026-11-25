# Electronics Learning

An interactive, offline website for learning electronics, one component at a time: simple explanations,
water analogies and live animations, from the resistor to real microchips.

## What's inside

- **Components**: resistor, capacitor, diode, LED, transistor, inductor, relay, sound & motion
- **Formulas** and **Sensors**
- **Microchips**: 15 common chips (555, 4017, LM358, LM386, 7805, …) with pinouts and demos
- **Real parts**: what the components look like in real life
- **Circuits**: 28 breadboard projects with wiring steps and animated demos
- **Build lab**: a breadboard simulator to place parts, wire them and measure voltages and currents
- **Quiz**, plus a shopping list of the parts needed

## Getting started

Open `build/index.html` in a browser. No install or server needed.

## Editing the site

The site in `build/` is generated: don't edit it by hand. Edit the sources in `src/`, then rebuild
(Python 3, no extra packages):

```
python src/build.py
```

The build must end with `checks: OK`. See [src/README.md](src/README.md) for how the sources are organised
and how to add pages, chips, circuits and parts.

To test the Build lab simulator:

```
node tools/simtest.js
```
