class FSM {
    /**
     * Creates new FSM instance.
     * @param config
     */

    constructor(config) {
        this.config = config;
        this.stack_states = []; //stack for previous states
        this.stack_undos = []; //stack for undos states
        this.current = this.config['initial'];
    }

    /**
     * Returns active state.
     * @returns {String}
     */
    getState() {
        return this.current;
    }

    /**
     * Goes to specified state.
     * @param state
     */
    changeState(state) {
        if (this.config['states'][state] == undefined) {
            throw new Error('Error');
            return false;
        }
        this.setState(state);
    }

    /**
     * Changes state according to event transition rules.
     * @param event
     */
    trigger(event) {
        let new_state = this.config['states'][this.current]['transitions'][event];
        if (new_state === undefined) {
            throw Error('Erorr');
        }
        this.setState(new_state);
    }

    /**
     * Resets FSM state to initial.
     */
    reset() {
        this.current = this.config['initial'];
    }

    /**
     * Returns an array of states for which there are specified event transition rules.
     * Returns all states if argument is undefined.
     * @param event
     * @returns {Array}
     */
    getStates(event) {
        let states = Array();
        let event_states = Array();
        for (var state in this.config['states']) {
            states.push(state);
            if (this.config['states'][state]['transitions'][event] !== undefined) {
                event_states.push(state);
            }
        }
        return event === undefined ? states : event_states;
    }

    /**
     * Goes back to previous state.
     * Returns false if undo is not available.
     * @returns {Boolean}
     */
    undo() {
        let prev = this.stack_states.pop();
        if (prev === undefined) {
            return false;
        }
        this.stack_undos.push(this.current);
        this.current = prev;

        return true;
    }

    /**
     * Goes redo to state.
     * Returns false if redo is not available.
     * @returns {Boolean}
     */
    redo() {
        let next = this.stack_undos.pop();
        if (next === undefined) {
            return false;
        }
        this.stack_states.push(this.current);
        this.current = next;

        return true;
    }

    /**
     * Clears transition history
     */
    clearHistory() {
        this.stack_states = [];
    }

    /**
     * Set new current state
     * @param state 
     */
    setState(state) {
        this.stack_states.push(this.current);
        this.current = state;
        this.stack_undos = [];
    }
}

module.exports = FSM;

/** @Created by Uladzimir Halushka **/
