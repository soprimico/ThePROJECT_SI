import { createClient }
from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabase = createClient(
    "https://frkmqrgbjeljgzaeodlu.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZya21xcmdiamVsamd6YWVvZGx1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEyMTAzNTYsImV4cCI6MjA4Njc4NjM1Nn0.pFlFPQhYJ0I9lsCPDI4PcSKZrXUpvHTBQq8lLcR3sDE"
);
const menu = document.getElementById("menu");

const {
    data:{session}
} = await supabase.auth.getSession();

if(session){

    menu.innerHTML = `
        <button onclick="location.href='index.html'">Home</button>
        <button onclick="location.href='shop.html'">Shop</button>
        <button onclick="location.href='help.html'">Help</button>
        <button onclick="location.href='profile.html'">Profile</button>
        <button id="logoutBtn">Logout</button>
    `;

    document
    .getElementById("logoutBtn")
    .addEventListener("click", async () => {

        await supabase.auth.signOut();

        location.href = "index.html";
    });

}else{

    menu.innerHTML = `
        <button onclick="location.href='index.html'">Home</button>
        <button onclick="location.href='shop.html'">Shop</button>
        <button onclick="location.href='help.html'">Help</button>
        <button onclick="location.href='login.html'">Login</button>
    `;
}