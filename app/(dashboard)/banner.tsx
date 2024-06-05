import { Text, Title, Button, Image } from '@mantine/core';
import image from '@/public/images/image.svg'; // Gambar yang lebih sesuai dengan konteks sekolah
import classes from './banner.module.css';

export default function Banner(
  { setAjukanPengajuan }: {
    setAjukanPengajuan: React.Dispatch<React.SetStateAction<boolean>>,
  }
) {
  return (
    <div className={classes.wrapper}>
      <div className={classes.body}>
        <Title className={classes.title}>Selamat Datang di Sistem Pengajuan Inventaris Sekolah</Title>
        <Text fw={500} fz="lg" mb={5}>
          Ajukan Pengajuan Peralatan Sekolah dengan Mudah!
        </Text>
        <Text fz="sm" c="dimmed" mb={5}>
          Dengan sistem kami, Anda dapat dengan sangat mudah mengajukan peralatan sekolah.
        </Text>

        <div className={classes.controls}>
          <Button className={classes.control} onClick={() => setAjukanPengajuan(true)}>Ajukan Pengajuan</Button> {/* Fungsi onClick untuk mengatur state ajukanPengajuan */}
        </div>
      </div>
      <Image src={image.src} className={classes.image} />
    </div>
  );
}
