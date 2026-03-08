document.addEventListener('DOMContentLoaded', () => {
    const audio = document.querySelector('#audioSejarah');
    const panel = document.querySelector('#panel-sabuk');
    const visualSabuk = document.querySelector('#visualSabuk');
    const judul = document.querySelector('#judul-sabuk');
    const arti = document.querySelector('#arti-sabuk');
    const marker = document.querySelector('#marker');
    
    let data = [];
    let idx = 0;
    let markerVisible = false;
    let isAppStarted = false;
    let isAudioFinished = false;
    let sabukInterval;

    // Mengambil data sabuk
    fetch('materi.json').then(r => r.json()).then(d => { data = d; });

    // 1. Ketika tombol Start diklik
    document.querySelector('#tombol-mulai').addEventListener('click', () => {
        document.querySelector('#layar-mulai').classList.add('tersembunyi');
        isAppStarted = true;
        
        // Jika kamera sudah menyorot marker saat klik start, langsung putar audio
        if(markerVisible && !isAudioFinished) {
            audio.play();
        }
    });

    // 2. Event ketika marker terdeteksi oleh kamera
    marker.addEventListener('markerFound', () => {
        markerVisible = true;
        
        // Putar audio jika aplikasi sudah mulai dan audio belum selesai
        if (isAppStarted && !isAudioFinished && audio.paused) {
            audio.play();
        }
        
        // Jika audio sudah tamat, munculkan panel teks dan sabuk 3D
        if (isAudioFinished) {
            panel.classList.remove('tersembunyi');
            visualSabuk.setAttribute('visible', 'true');
        }
    });
    
    // 3. Event ketika marker hilang dari kamera
    marker.addEventListener('markerLost', () => {
        markerVisible = false;
        
        // Jeda audio jika marker hilang agar pengguna tidak ketinggalan cerita
        if (!isAudioFinished) {
            audio.pause();
        }
        
        // Sembunyikan panel dan sabuk 3D
        panel.classList.add('tersembunyi');
        visualSabuk.setAttribute('visible', 'false');
    });

    // 4. Ketika Audio selesai diputar
    audio.onended = () => {
        isAudioFinished = true;
        
        // Jika marker masih terlihat, langsung mulai siklus sabuk
        if (markerVisible) {
            mulaiSiklusSabuk();
        }
    };

    function mulaiSiklusSabuk() {
        panel.classList.remove('tersembunyi');
        visualSabuk.setAttribute('visible', 'true');
        
        // Tampilkan sabuk pertama
        updateSabuk();
        
        // Ganti sabuk otomatis setiap 5 detik
        if (sabukInterval) clearInterval(sabukInterval);
        sabukInterval = setInterval(() => {
            idx = (idx + 1) % data.length;
            updateSabuk();
        }, 5000); 
    }

    function updateSabuk() {
        if (data.length === 0) return;
        const s = data[idx];
        judul.innerText = s.sabuk;
        arti.innerText = s.arti;
        visualSabuk.setAttribute('color', s.warna);
    }
});