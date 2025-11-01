document.addEventListener('DOMContentLoaded', function() {
    const info = document.getElementById('info');
    const btn1 = document.getElementById('btn1');
    const btn2 = document.getElementById('btn2');
    const btn3 = document.getElementById('btn3');

    btn1.addEventListener('click', function() {
        info.textContent = '✅ Kauf erfolgreich! Das Produkt wurde gekauft.';
    });

    btn2.addEventListener('click', function() {
        info.textContent = '🛒 Produkt wurde zum Warenkorb hinzugefügt.';
    });

    btn3.addEventListener('click', function() {
        info.textContent = '⭐ Produkt zu Favoriten hinzugefügt.';
    });
});

