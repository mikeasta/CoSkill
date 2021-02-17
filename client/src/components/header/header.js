import React from 'react';
import "../../layout/header.css"

const Header = () => {
    const user = {
        name: "Moo",
        secondName: "Min",
        avatar:"https://sun9-69.userapi.com/impg/yOyOCofk2QWpjiSLTs7D6ZtxEzxW7zLlbH1FBA/T4RDmYLU8Qo.jpg?size=541x551&quality=96&proxy=1&sign=77c757f173d271632d91b5818440674d&type=album"
    }
    return (
        <header>
            <h2 className="header-logo">
                Co-Skill
            </h2>
            <section id="search">   
                <input type="text" placeholder="Type to search"></input>
                <button className="btn btn-success">
                    <i className="fas fa-search"></i>
                </button>
            </section>

            <section id="header-buttons-container">
                <div className="in-development">
                    IN DEVELOPMENT
                </div>
                <button>
                    <i className="far fa-bell"></i>
                </button>
                <button>
                    <i className="far fa-envelope"></i>
                </button>
            </section>

            <section id="user-cabinet">
                <i className="fas fa-sort-down"></i>
                <div className="user-cabinet-text">
                    <p className="user-cabinet-name">
                        { user.name + " " + user.secondName }
                    </p>
                    <p>Tap to view profile <i className="fas fa-arrow-right"></i></p>
                </div>
                <div className="user-cabinet-photo">
                    <img src={ user.avatar } alt="user avatar"></img>
                </div>
            </section>
        </header>
    )
}

export default Header;