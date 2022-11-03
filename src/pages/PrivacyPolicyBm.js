import React from "react";
import logo2 from "../../src/assets/logo_2.png";
import logo1 from "../../src/assets/logo_1.png";

function PrivacyPolicyBm() {
  return (
    <div className="bgPrivacyPolicy">
      <div className="topBar privacyPolicyBar">
        <div className="leftTopBar">
          <img
            src={logo1}
            alt="logo"
            style={{ width: "40px", height: "40px" }}
          />
          <h3>OLa</h3>
        </div>
      </div>

      <div className="content">
        {/* <h1 className="title">Privacy Policy</h1> */}
        <p>
          <i>Kemas kini terakhir pada 1 November 2022</i>
        </p>

        <div>
          <h1 className="subTitle">Pengenalan</h1>
          <p>
            Aplikasi Antikoagulasi Oral (OLa) menyediakan cara mudah untuk
            pengguna memantau sendiri kesihatan mereka dan menguruskan
            penggunaan antikoagulasi oral mereka menggunakan alat mudah. Setiap
            pengguna akan dapat:
          </p>

          <br />

          <ul style={{ listStyle: "inside" }}>
            <li>
              Pantau sendiri tanda-tanda vital mereka seperti tekanan darah dan
              paras glukosa serta gejala pendarahan
            </li>
            <li>Catatkan nota harian mereka dalam diari kesihatan</li>
            <li>Lihat data yang direkodkan dalam bentuk jadual atau grafik</li>
            <li>
              Mendidik diri mereka tentang keadaan perubatan yang berkaitan dan
              antikoagulan oral menggunakan modul pembelajaran
            </li>
            <li>Tetapkan matlamat kesihatan yang diperibadikan</li>
            <li>Tetapkan peringatan untuk temu janji klinik</li>
          </ul>

          <p>
            <h3>Sumber: </h3>Pasukan Penyelidik OLa, Universiti Malaya dan
            Klinik Kegagalan Jantung, Hospital Kuala Lumpur
          </p>
        </div>

        <div>
          <h1 className="subTitle">Dasar privasi</h1>
          <p>
            <b>Perlindungan Data</b> <br /> Teknologi terkemuka termasuk
            perisian penyulitan digunakan untuk melindungi sebarang data yang
            diberikan kepada kami dan piawaian keselamatan yang ketat dikekalkan
            untuk menghalang capaian yang tidak dibenarkan. <br /> <br />{" "}
            <b>Keselamatan penyimpanan data</b> <br /> Untuk melindungi data
            peribadi anda, semua penyimpanan elektronik dan penghantaran data
            peribadi dilindungi dan disimpan dengan teknologi keselamatan yang
            sesuai. <br /> <br /> <b> Maklumat keselamatan </b> <br /> Domain
            universiti mempunyai langkah keselamatan terhadap kehilangan,
            penyalahgunaan, dan pengubahan maklumat seperti yang ditakrifkan
            dalam Peraturan - Peraturan Universiti untuk Penggunaan Kemudahan
            ICT. <br /> <br /> Log masuk menggunakan nombor telefon dan kata
            laluan satu kali (OTP) yang dijana sistem selamat diperlukan untuk
            mengakses akaun pengguna. Sebelum maklumat peribadi (seperti
            parameter pemantauan diri seperti tekanan darah) diakses pada papan
            pemuka pegawai profesional penjagaan kesihatan, doktor atau pegawai
            farmasi dikehendaki memasukkan alamat e-mel yang diluluskan oleh
            pentadbir aplikasi dan pautan akan dihantar ke e-mel tersebut untuk
            akses. Ini adalah untuk memastikan maklumat dipaparkan hanya kepada
            orang yang dimaksudkan.
          </p>
        </div>

        <div>
          <h1 className="subTitle">Penafian</h1>

          <p>
            Aplikasi ini dicipta untuk tujuan penyelidikan dengan niat untuk
            membantu pengguna (pesakit dengan fibrilasi atrium (degupan jantung
            tidak teratur) dan kegagalan jantung) menguruskan penggunaan ubat
            antikoagulasi (penelak darah beku) oral mereka. Walau bagaimanapun,
            ia tidak bertujuan untuk menggantikan penilaian klinikal
            profesional. <br /> <br />
            Pembangun tidak membuat tuntutan tentang ketepatan maklumat yang
            terkandung di sini; dan maklumat ini tidak menggantikan penilaian
            klinikal. <br /> <br />
            Semua pihak yang terlibat dalam penyediaan aplikasi ini tidak akan
            bertanggungjawab ke atas sebarang kerosakan khas, berbangkit atau
            teladan yang mengakibatkan keseluruhan atau sebahagian daripada
            penggunaan atau pergantungan mana-mana pengguna terhadap bahan ini.
          </p>
        </div>

        <div>
          <h1 className="subTitle">Maklumbalas</h1>
          <p>ola_admin@um.edu.my</p>
        </div>
      </div>
    </div>
  );
}

export default PrivacyPolicyBm;
