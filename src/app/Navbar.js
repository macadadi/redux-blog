import React from 'react'
import { Link } from 'react-router-dom'
export const Navbar = () => {
  return (
    <nav>
      <section>
        <h1>Redux Blog </h1>

        <div className="navContent">
          <div className="navLinks"></div>
            <div className="navLinks">
            <Link to="/">Posts</Link>
          </div>
        </div>
      </section>
    </nav>
  )
}
