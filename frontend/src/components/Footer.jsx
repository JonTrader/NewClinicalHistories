import React from 'react'

function Footer() {
    return (
        <footer className="footer sm:footer-horizontal footer-center bg-blueDeep text-lightOcre p-4 absolute bottom-0">
            <aside>
                <p>Copyright © {new Date().getFullYear()} - Jtech</p>
            </aside>
        </footer>
    )
}

export default Footer