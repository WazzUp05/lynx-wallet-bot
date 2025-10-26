import Link from 'next/link';
import React from 'react';
import ArrowLeftIcon from '@/components/icons/arrow-left.svg';
import MobileIcon from '@/components/icons/mobile.svg';
import LockIcon from '@/components/icons/lock.svg';
import QrIcon from '@/components/icons/qr.svg';
import TimeIcon from '@/components/icons/time.svg';
import Profile2UserIcon from '@/components/icons/profile-2user.svg';
import FaqItem from '@/components/FaqItem';
import Image from 'next/image';

const Page = () => {
    return (
        <>
            <div className="px-[1.6rem] py-[2rem] w-full bg-[var(--bg-optional)] min-h-[100dvh] flex flex-col">
                <div className="flex gap-[1rem] items-center mb-[3.2rem]">
                    <Link
                        href="/profile"
                        className="w-[3.5rem] h-[3.5rem] bg-[var(--bg-secondary)] text-[var(--text-secondary)] rounded-[1rem] center"
                    >
                        <ArrowLeftIcon width={16} height={16} className="w-[1.6rem] h-[1.6rem]" />
                    </Link>
                    <h1 className="text-[1.8rem] leading-[130%] font-semibold text-[var(--text-main)]">
                        Часто задаваемые вопросы
                    </h1>
                </div>
                <div className="bg-[var(--bg-secondary)] rounded-[2rem] p-[1.6rem]">
                    <h4 className="text-[2.5rem] leading-[130%] font-semibold text-[var(--text-main)] mb-[0.8rem]">
                        Помощь в решении вопросов
                    </h4>
                    <p className="text-[1.6rem] leading-[130%] text-[var(--text-main)] mb-[3.2rem]">
                        База знаний для клиентов Lynx. Всё, что нужно знать о нашем сервисе.
                    </p>
                    <div className="flex flex-col gap-[1.2rem]">
                        <a
                            href="#application"
                            className="flex items-center gap-[1rem] justify-between bg-[var(--bg-main)] p-[1.6rem] text-[var(--text-secondary)] rounded-[1.5rem] text-[1.5rem] leading-[130%] font-semibold"
                        >
                            Приложение{' '}
                            <div className="w-[3.5rem] h-[3.5rem] bg-[var(--yellow-secondary)] text-[var(--yellow)] rounded-[1rem] center">
                                <MobileIcon width={20} height={20} className="w-[2rem] h-[2rem]" />
                            </div>
                        </a>
                        <a
                            href="#security"
                            className="flex items-center gap-[1rem] justify-between bg-[var(--bg-main)] p-[1.6rem] text-[var(--text-secondary)] rounded-[1.5rem] text-[1.5rem] leading-[130%] font-semibold"
                        >
                            Безопасность{' '}
                            <div className="w-[3.5rem] h-[3.5rem] bg-[var(--yellow-secondary)] text-[var(--yellow)] rounded-[1rem] center">
                                <LockIcon width={20} height={20} className="w-[2rem] h-[2rem]" />
                            </div>
                        </a>
                        <a
                            href="#payments"
                            className="flex items-center gap-[1rem] justify-between bg-[var(--bg-main)] p-[1.6rem] text-[var(--text-secondary)] rounded-[1.5rem] text-[1.5rem] leading-[130%] font-semibold"
                        >
                            Платежи и переводы{' '}
                            <div className="w-[3.5rem] h-[3.5rem] bg-[var(--yellow-secondary)] text-[var(--yellow)] rounded-[1rem] center">
                                <QrIcon width={20} height={20} className="w-[2rem] h-[2rem]" />
                            </div>
                        </a>
                        <a
                            href="#plans"
                            className="flex items-center gap-[1rem] justify-between bg-[var(--bg-main)] p-[1.6rem] text-[var(--text-secondary)] rounded-[1.5rem] text-[1.5rem] leading-[130%] font-semibold"
                        >
                            Наши планы{' '}
                            <div className="w-[3.5rem] h-[3.5rem] bg-[var(--yellow-secondary)] text-[var(--yellow)] rounded-[1rem] center">
                                <TimeIcon width={20} height={20} className="w-[2rem] h-[2rem]" />
                            </div>
                        </a>
                        {/* <a
                            href="#referral"
                            className="flex items-center gap-[1rem] justify-between bg-[var(--bg-main)] p-[1.6rem] text-[var(--text-secondary)] rounded-[1.5rem] text-[1.5rem] leading-[130%] font-semibold"
                        >
                            Реферальная программа{' '}
                            <div className="w-[3.5rem] h-[3.5rem] bg-[var(--yellow-secondary)] text-[var(--yellow)] rounded-[1rem] center">
                                <Profile2UserIcon width={20} height={20} className="w-[2rem] h-[2rem]" />
                            </div>
                        </a> */}
                    </div>
                </div>

                {/* Приложение */}
                <div id="application" className="mt-[3.2rem]">
                    <h4 className="text-[2.5rem] leading-[130%] font-semibold text-[var(--text-main)] mb-[1.6rem]">
                        Приложение
                    </h4>
                    <div className="flex flex-col ">
                        <FaqItem
                            question="Когда появится приложение нашего кошелька?"
                            answer="Lynx уже доступен прямо в Telegram — не нужно ничего скачивать или устанавливать. Просто откройте мини-приложение и пользуйтесь кошельком в привычном мессенджере."
                        />
                    </div>
                </div>

                {/* Безопасность */}
                <div id="security" className="mt-[3.2rem]">
                    <h4 className="text-[2.5rem] leading-[130%] font-semibold text-[var(--text-main)] mb-[1.6rem]">
                        Безопасность
                    </h4>
                    <div className="flex flex-col ">
                        <FaqItem
                            question="Что такое AML-проверка?"
                            answer="Это автоматическая система, которая помогает распознавать подозрительные транзакции и защищает пользователей от мошенников."
                        />
                        <FaqItem
                            question="Как снизить риск задержки транзакций?"
                            answer="Перед переводом убедитесь, что выбрана правильная сеть и адрес получателя. Это помогает избежать ошибок и дополнительных проверок."
                        />
                        <FaqItem
                            question="Почему перевод может временно задержаться?"
                            answer="Иногда платёжная система или сеть блокчейна проводят дополнительную проверку. Это стандартная процедура, ваши средства не пропадают."
                        />
                        <FaqItem
                            question="Что делать, если перевод всё ещё не поступил?"
                            answer={`Проверьте статус транзакции в Lynx. Если он не обновляется, напишите нам <a class="link" href="https://t.me/Lynxwalletsupport_bot">в поддержку</a> и укажите номер перевода — мы поможем разобраться.`}
                        />
                    </div>
                </div>

                {/* Платежи и переводы */}
                <div id="payments" className="mt-[3.2rem]">
                    <h4 className="text-[2.5rem] leading-[130%] font-semibold text-[var(--text-main)] mb-[1.6rem]">
                        Платежи и переводы
                    </h4>
                    <div className="flex flex-col ">
                        <FaqItem
                            question="Как проходит оплата в Lynx?"
                            answer="Платите криптой по QR или ссылке, а продавец получает рубли через СБП. Всё происходит быстро, просто и безопасно."
                        />
                        <FaqItem
                            question="Можно ли отменить оплату, если заказ отменён или товар не получен?"
                            answer={`<div>Да. Если покупка не состоялась, напишите <a class="link" href="https://t.me/Lynxwalletsupport_bot">в поддержку</a> — мы свяжемся с продавцом и поможем оформить возврат. </div>`}
                        />
                        <FaqItem
                            question="Какая сумма доступна для одного платежа?"
                            answer="Лимит зависит от уровня верификации и выбранной валюты. Актуальные данные отображаются прямо во время перевода."
                        />
                        <FaqItem
                            question="Откуда поступают деньги при продаже криптовалюты на карту?"
                            answer="Переводы выполняются через СБП нашим платёжным партнёром — средства поступают напрямую на вашу карту."
                        />
                        <FaqItem
                            question="Какие лимиты действуют при продаже криптовалюты?"
                            answer="Ограничения зависят от сети и валюты. Мы показываем лимиты перед каждой транзакцией, чтобы всё было прозрачно."
                        />
                    </div>
                </div>

                {/* Наши планы */}
                <div id="plans" className="mt-[3.2rem]">
                    <h4 className="text-[2.5rem] leading-[130%] font-semibold text-[var(--text-main)] mb-[1.6rem]">
                        Наши планы
                    </h4>
                    <div className="flex flex-col ">
                        <FaqItem
                            question="Когда появится поддержка других криптовалют?"
                            answer="Мы постепенно расширяем список поддерживаемых сетей и монет. В планах — популярные блокчейны, включая TON. О запуске новых валют сообщаем внутри Lynx сразу после готовности."
                        />
                        <FaqItem
                            question="Планируется ли выпуск собственной криптовалюты Lynx?"
                            answer="Пока мы сосредоточены на скорости и удобстве сервиса. Возможность выпуска собственного токена рассматривается на будущее."
                        />
                    </div>
                </div>

                {/* Реферальная программа */}
                {/* <div id="referral" className="mt-[3.2rem] mb-[3.2rem]">
                    <h4 className="text-[2.5rem] leading-[130%] font-semibold text-[var(--text-main)] mb-[1.6rem]">
                        Реферальная программа
                    </h4>
                    <div className="flex flex-col ">
                        <FaqItem
                            question="Как работает реферальная программа?"
                            answer="Приглашайте друзей по вашей реферальной ссылке и получайте процент от их транзакций. Чем больше активных рефералов, тем выше ваш доход."
                        />
                        <FaqItem
                            question="Какой процент я получаю от рефералов?"
                            answer="Базовая ставка составляет 10% от комиссий сервиса с транзакций ваших рефералов. Для активных партнеров предусмотрены повышенные ставки."
                        />
                        <FaqItem
                            question="Как вывести реферальный доход?"
                            answer="Реферальный доход начисляется на ваш основной баланс и может быть выведен так же, как и основные средства, без дополнительных комиссий."
                        />
                        <FaqItem
                            question="Есть ли ограничения по количеству рефералов?"
                            answer="Нет, количество рефералов не ограничено. Чем больше активных пользователей вы приведете, тем больше будет ваш пассивный доход."
                        />
                    </div>
                </div> */}
            </div>
            <div className="bg-[var(--bg-secondary)] py-[3rem] px-[1.6rem]">
                <Image
                    src="/logo_yellow.png"
                    alt="Lynx"
                    width={120 * 2}
                    height={46 * 2}
                    quality={100}
                    className="mb-[3rem] w-[12rem] h-[4.6rem]"
                />
                <p className="flex gap-[0.5rem]  text-[1.6rem] leading-[130%] text-[var(--text-secondary)] mb-[3rem]">
                    <span>*</span> Под термином «Оплата» понимается процесс обмена товаров или услуг на криптовалюту.
                </p>
                <p className="text-[1.6rem] leading-[130%] text-[var(--text-secondary)]">
                    {new Date().getFullYear()}, Lynx LLC
                </p>
            </div>
        </>
    );
};

export default Page;
