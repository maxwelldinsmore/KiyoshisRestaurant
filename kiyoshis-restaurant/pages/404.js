/**
 * File: 404.js
 * Authors: Max
 * Last Edited: 2026-04-07
 * Description: This file is for the 404 page component
 */

export default function Custom404() {
    return (
        <div className={"content"} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
            <section className={"card"}>
                <p>
                    We couldn't find the page you were looking for.
                </p>
            </section>
        </div>
    )
}