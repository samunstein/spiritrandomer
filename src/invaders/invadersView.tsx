import { Component } from "react";

class InvadersView extends Component {
    constructor(props: any) {
        super(props);
        this.state = {
            name: "React",
        };
    }

    render() {
        return (
            <div>Tässä on niitä inveidereitä</div>
        )
    }
}

export default InvadersView;