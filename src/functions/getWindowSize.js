import PropTypes from 'prop-types'
import React, { Component } from 'react'

export default class getWindowSize extends Component {
    constructor(props) {
        super(props);
        this.state = { windowWidth: 0, windowHeight: 0 };
        this.handleResize = this.handleResize.bind(this);
    }
    
    componentDidMount() {
        this.handleResize();
        window.addEventListener('resize', this.handleResize);
    }
    
    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
    }
    
    handleResize() {
        this.setState({ windowWidth: window.innerWidth, windowHeight: window.innerHeight });
    }

      
}

