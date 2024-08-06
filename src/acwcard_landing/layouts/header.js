import React from "react";
import { Link, Redirect } from "react-router-dom";

const token = localStorage.getItem("acwtoken");
const type = localStorage.getItem("type");

class AddApp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectTab: "home",
            phoneView: false,
            matches: window.matchMedia("(min-width: 900px)").matches
        }
    }
    componentDidMount() {
        const handler = e => this.setState({ matches: e.matches });
        window.matchMedia("(min-width: 900px)").addEventListener('change', handler);
    }
    onClick = (e) => {
        this.setState({ selectTab: e })
        if (!this.state.matches) {
            let btn = document.getElementById("closeModal");
            btn.click();
        }
    }
    account = () => {
        if (type == 'admin') {
            window.location.href = "/admin";
        } else {
            this.setState({ account: true })
        }
    }
    render() {
        if (this.state.account) return <Redirect to={'/account'} />

        return (
            <>
                <section class="navbar_section minmum_size">
                    <div className="container-fluid">
                        <div class="navbar_body">
                            <nav class="navbar navbar-expand-lg navbar-light">
                                <a class="navbar-brand" href="#"><img src="./assets/images/acw_card_logo.png" /></a>
                                <button class="navbar-toggler" id="closeModal" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                                    <span class="navbar-toggler-icon"></span>
                                </button>
                                <div class="collapse navbar-collapse" id="navbarNav">
                                    <ul class="navbar-nav ml-auto">
                                        <li class={this.state.selectTab == 'home' ? "nav-item active" : 'nav-item'} >
                                            <a class="nav-link js-scroll-trigger" onClick={(e) => this.onClick("home")} href="#" aria-current="page" >Home</a>
                                        </li>
                                        <li class={this.state.selectTab == 'features' ? "nav-item active" : 'nav-item'}>
                                            <a class="nav-link js-scroll-trigger" onClick={(e) => this.onClick("features")} href="#features">Features</a>
                                        </li>
                                        <li class={this.state.selectTab == 'works' ? "nav-item active" : 'nav-item'}>
                                            <a class="nav-link js-scroll-trigger" onClick={(e) => this.onClick("works")} href="#works">How it Works</a>
                                        </li>
                                        <li class={this.state.selectTab == 'enquiry' ? "nav-item active" : 'nav-item'}>
                                            <a class="nav-link js-scroll-trigger" onClick={(e) => this.onClick("enquiry")} href="#enquiry">Enquiry</a>
                                        </li>
                                        {
                                            token
                                                ?
                                                <li class="nav-item">
                                                    <div style={{ cursor: 'pointer' }} onClick={this.account} class="nav-link js-scroll-trigger log_static_b" href="#features">Account</div>
                                                </li>
                                                :
                                                <li class="nav-item">
                                                    <Link to='/login' class="nav-link js-scroll-trigger log_static_b" href="#features">Login</Link>
                                                </li>
                                        }

                                    </ul>
                                </div>
                            </nav>
                        </div>
                    </div>
                </section >
            </>
        )
    }
}

export default AddApp;

