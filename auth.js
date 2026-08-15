import { createClient }
from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";


const supabase = createClient(
    "https://frkmqrgbjeljgzaeodlu.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZya21xcmdiamVsamd6YWVvZGx1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEyMTAzNTYsImV4cCI6MjA4Njc4NjM1Nn0.pFlFPQhYJ0I9lsCPDI4PcSKZrXUpvHTBQq8lLcR3sDE"
);

const menu = document.getElementById("menu");

const {
    data: { session }
} = await supabase.auth.getSession();

if (session) {

    const { data: profile } = await supabase
        .from("profiles")
        .select("coins")
        .eq("id", session.user.id)
        .single();

    const coins = profile?.coins ?? 0;

    menu.innerHTML = `
        <button onclick="location.href='index.html'">Home</button>
        <button onclick="location.href='shop.html'">Shop</button>
        <button onclick="location.href='help.html'">Help</button>

        <span style="
            display:inline-flex;
            align-items:center;
            height:100%;
            margin:0 12px;
            font-weight:bold;
            color:white;
            font-size:18px;">
            🪙 ${coins}
        </span>

        <div style="display:inline-block;position:relative;">
            <button id="menuBtn">☰</button>

            <div id="dropdownMenu"
                 style="
                    display:none;
                    position:absolute;
                    right:0;
                    top:100%;
                    background:black;
                    border:1px solid #000000;
                    color:white;
                    padding:5px;
                    z-index:1000;
                    min-width:120px;
                 ">
                <button
                    style="display:block;width:100%;margin-bottom:5px;"
                    onclick="location.href='profile.html'">
                    Profile
                </button>

                <button
                    id="logoutBtn"
                    style="display:block;width:100%;">
                    Logout
                </button>
            </div>
        </div>
    `;

    const menuBtn = document.getElementById("menuBtn");
    const dropdownMenu = document.getElementById("dropdownMenu");

    menuBtn.addEventListener("click", (e) => {
        e.stopPropagation();

        dropdownMenu.style.display =
            dropdownMenu.style.display === "none"
                ? "block"
                : "none";
    });

    document.addEventListener("click", () => {
        dropdownMenu.style.display = "none";
    });

    document
        .getElementById("logoutBtn")
        .addEventListener("click", async () => {

            await supabase.auth.signOut();

            location.href = "index.html";
        });

} else {

    menu.innerHTML = `
        <button onclick="location.href='index.html'">Home</button>
        <button onclick="location.href='shop.html'">Shop</button>
        <button onclick="location.href='help.html'">Help</button>
        <button onclick="location.href='login.html'">Login</button>
    `;
}