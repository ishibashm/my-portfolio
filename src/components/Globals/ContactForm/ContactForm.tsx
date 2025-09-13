'use client';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useState } from 'react';

type Inputs = {
  name: string;
  email: string;
  message: string;
};

export const ContactForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Inputs>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setIsSubmitting(true);
    setIsSuccess(false);
    setIsError(false);

    try {
      const response = await fetch('https://formspree.io/f/mqadjndp', { // TODO: FormspreeのIDに置き換える
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setIsSuccess(true);
        reset();
      } else {
        setIsError(true);
      }
    } catch (error) {
      setIsError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="contact-form">
      <div className="form-group">
        <label htmlFor="name">お名前</label>
        <input
          id="name"
          {...register('name', { required: 'お名前は必須です' })}
        />
        {errors.name && <p className="error-message">{errors.name.message}</p>}
      </div>
      <div className="form-group">
        <label htmlFor="email">メールアドレス</label>
        <input
          id="email"
          type="email"
          {...register('email', {
            required: 'メールアドレスは必須です',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: '有効なメールアドレスを入力してください',
            },
          })}
        />
        {errors.email && (
          <p className="error-message">{errors.email.message}</p>
        )}
      </div>
      <div className="form-group">
        <label htmlFor="message">お問い合わせ内容</label>
        <textarea
          id="message"
          rows={5}
          {...register('message', { required: 'お問い合わせ内容は必須です' })}
        />
        {errors.message && (
          <p className="error-message">{errors.message.message}</p>
        )}
      </div>
      <button type="submit" className="submit-button" disabled={isSubmitting}>
        {isSubmitting ? '送信中...' : '送信'}
      </button>
      {isSuccess && (
        <p className="success-message">
          お問い合わせありがとうございます。メッセージは正常に送信されました。
        </p>
      )}
      {isError && (
        <p className="error-message">
          メッセージの送信に失敗しました。時間をおいて再度お試しください。
        </p>
      )}
    </form>
  );
};