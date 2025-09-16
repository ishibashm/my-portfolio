import { ContactForm } from '@/components/Globals/ContactForm/ContactForm';

const ContactPage = () => {
  return (
    <div className="container" style={{ paddingTop: '120px' }}>
      <h1 style={{ color: 'white', textAlign: 'center', marginBottom: '40px' }}>Contact Us</h1>
      <ContactForm />
    </div>
  );
};

export default ContactPage;