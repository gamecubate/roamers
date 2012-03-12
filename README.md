# Cellular automaton plugin for ImpactJS #

A cellular automaton plugin for the Impact javascript game engine (http://impactjs.com/). The base class, Automaton, extends ig.Class and maintains a population of cells, some alive and the rest dead, the status of which it updates every time its step function is invoked. Subclasses should override this function to provide their own behaviour. One such subclass, Conway, is provided with this package and serves as a basic example. — Read more

* Created by Alexandre Rousseau for [gamecubate](http://www.gamecubate.com); use at will but at own risk.
* Sample project and comments at http://www.gamecubate.com/playground/automata_plugin_demo .
* You can reach me by email (alexr at gamecubate dot com) or via the Impact forums (alexandre).

# Installation

* Inside your ImpactJS project's plugins folder, make subfolders gamecubate and gamecubate/automata.
* Move automaton.js and conway.js inside ``[PROJECT]/lib/plugins/gamecubate/automata/``
* Add the plugin to your main.js file
<pre>
    ig.module(
        'game.main'
    )
    .requires(
        'impact-game',
        ...
        'plugins.gamecubate.automata.conway',
        ...
    )
</pre>

# More Information

* See https://github.com/gamecubator/demo-plugin-automata/ for sample usage.
