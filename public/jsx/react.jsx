var SpellBox = React.createClass({
    getInitialState: function() { return {spells: {}, data: []}; },
    componentDidMount: function() {
        $.ajax({
            url: "dnd/spells.json",
            dataType: 'json',
            cache: false,
            success: function(data) {
                this.setState({spells: data, data: Object.values(data)});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error("dnd/spells.json", status, err.toString());
            }.bind(this)
        });
    },
    filters: {},
    filter: function() {
        this.state.data = [];
        for (var k in Object.keys(this.state.spells)) {
            var shown = true;
            for (var f in Object.values(this.filters)) if (!f(this.state.spells[k])) shown = false;
            if (shown) data.push(this.state.spells[k]);
        }
        this.setState({spells: this.state.spells, data: this.state.data});
    },
    sortInfo: {sort: "name", reverse: false},
    setSort: function(s) {
        if (this.sortInfo.sort==s) this.sortInfo.reverse = !this.sortInfo.reverse;
        else this.sortInfo = {sort: s, reverse: false};
        this.sort();
    },
    sort: function() {
        this.state.data.sort(function(a, b) {
            return (this.sortInfo.reverse ? -1 : 1) * (a[this.sortInfo.sort] < b[this.sortInfo.sort] ? -1 : a[this.sortInfo.sort] > b[this.sortInfo.sort] ? 1 : 0); //if reverse is true, sort in the opposite direction.
        }.bind(this));
        this.setState(this.state);
    },
    render: function() {
        var sortName = function() { this.setSort("name"); }.bind(this);
        return (
            <div>
                <button onClick={sortName}>Sort</button>
                <SpellTable spells={this.state.data} />
            </div>
        )
    }
});

var SpellTable = React.createClass({
    render: function() {
        var spellNodes = this.props.spells.map(function(s) {
            return(<Spell spell={s} />);
        });
        return(
            <div className="spellList">
                {spellNodes}
            </div>
        )
    }
});

var Spell = React.createClass({
    render: function() {
        return (
            <div className="Spell">
                {this.props.spell.name} {this.props.spell.level}
            </div>
        )
    }
});

ReactDOM.render(
    <SpellBox />,
    document.getElementById('content')
);