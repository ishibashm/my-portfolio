'use client';
import { useForm, SubmitHandler } from 'react-hook-form';
import styles from './ContactForm.module.css';

type Inputs = {
  name: string;
  email: string;
  message: string;
};

export const ContactForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = data => console.log(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <div className={styles.formGroup}>
        <label htmlFor="name">お名前</label>
        <input id="name" {...register("name", { required: true })} />
        {errors.name && <span className={styles.error}>このフィールドは必須です</span>}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="email">メールアドレス</label>
        <input id="email" {...register("email", { required: true, pattern: /^\S+@\S+$/i })} />
        {errors.email && <span className={styles.error}>有効なメールアドレスを入力してください</span>}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="message">お問い合わせ内容</label>
        <textarea id="message" {...register("message", { required: true })} rows={6} />
        {errors.message && <span className={styles.error}>このフィールドは必須です</span>}
      </div>

      <button type="submit" className={styles.submitButton}>送信</button>
    </form>
  );
};