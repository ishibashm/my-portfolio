import { ContactForm } from '@/components/Globals/ContactForm/ContactForm';
import styles from './contact.module.css';

const ContactPage = () => {
  return (
    <div className={styles.contact}>
      <div className="container">
        <h1>Contact Us</h1>
        <p className={styles.lead}>プロジェクトのご相談、採用に関するお問い合わせなど、お気軽にご連絡ください。</p>

        <div className={styles.grid}>
          <div className={styles.formWrapper}>
            <ContactForm />
          </div>
          <div className={styles.info}>
            <h2>会社情報</h2>
            <p>
              <strong>MyCorp Inc.</strong><br />
              〒100-0001 東京都千代田区千代田1-1<br />
              TEL: 03-1234-5678<br />
              Email: contact@mycorp.example.com
            </p>
            <div className={styles.map}>
              {/* Google Mapsなどの埋め込みを想定 */}
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3240.828236324546!2d139.7520426152582!3d35.68123618019422!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60188bf90da41039%3A0x2de5410a96502a55!2sImperial%20Palace!5e0!3m2!1sen!2sjp!4v16788864 Imperial Palace"
                width="100%"
                height="300"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;