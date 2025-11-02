# События телеметрии

## QR Сканирование (`src/app/qr/page.tsx`)

1. **qr_scan_page_opened** - Открытие страницы QR-сканирования

    - Параметры: нет

2. **qr_scan_page_closed** - Закрытие страницы QR-сканирования

    - Параметры: нет

3. **qr_code_scanned** - Отсканирован QR-код

    - Параметры: `{ has_url: boolean }`

4. **qr_scan_success** - Успешное сканирование QR-кода

    - Параметры: `{ rub_amount: number, usdt_amount: number, has_amount_in_url: boolean, prepare_required?: boolean }`

5. **qr_scan_error** - Ошибка сканирования QR-кода

    - Параметры: `{ reason: string }`

6. **qr_prepare_error** - Ошибка при запросе prepare

    - Параметры: `{ code: string, error: string }`

7. **qr_payment_modal_opened** - Открытие модалки оплаты

    - Параметры: `{ rub_amount: number, usdt_amount: number }`

8. **qr_payment_initiated** - Инициация платежа

    - Параметры: `{ rub_amount: number, usdt_amount: number, rate: string }`

9. **qr_payment_order_created** - Создан заказ

    - Параметры: `{ order_uuid: string, rub_amount: number, usdt_amount: number }`

10. **qr_payment_order_error** - Ошибка при создании заказа

    - Параметры: `{ rub_amount: number, usdt_amount: number, error: string }`

11. **qr_payment_modal_closed** - Закрытие модалки оплаты

    - Параметры: `{ rub_amount: number, usdt_amount: number }`

12. **qr_error_modal_closed** - Закрытие модалки ошибки
    - Параметры: нет

---

## Оплата по ссылке (`src/app/link/page.tsx`)

1. **link_payment_page_opened** - Открытие страницы оплаты по ссылке

    - Параметры: нет

2. **link_payment_page_closed** - Закрытие страницы оплаты по ссылке

    - Параметры: нет

3. **link_pasted** - Вставлена ссылка

    - Параметры: `{ has_url: boolean }`

4. **link_validation_error** - Ошибка валидации ссылки

    - Параметры: `{ error: 'empty_link' | 'invalid_format' | 'invalid_link_format' }`

5. **link_submitted** - Отправлена ссылка

    - Параметры: `{ has_url: boolean }`

6. **link_prepare_error** - Ошибка при запросе prepare

    - Параметры: `{ code: string, error: string }`

7. **link_payment_modal_opened** - Открытие модалки оплаты

    - Параметры: `{ rub_amount: number, usdt_amount: number }`

8. **link_payment_modal_closed** - Закрытие модалки оплаты

    - Параметры: `{ rub_amount: number, usdt_amount: number }`

9. **link_payment_initiated** - Инициация платежа

    - Параметры: `{ rub_amount: number, usdt_amount: number, rate: string }`

10. **link_payment_order_created** - Создан заказ

    - Параметры: `{ order_uuid: string, rub_amount: number, usdt_amount: number }`

11. **link_payment_order_error** - Ошибка при создании заказа
    - Параметры: `{ rub_amount: number, usdt_amount: number, error: string }`

---

## Статус платежа (`src/app/status/[id]/page.tsx`)

1. **payment_status_page_opened** - Открытие страницы статуса платежа

    - Параметры: `{ order_id: string }`

2. **payment_status_refreshed** - Обновление статуса платежа

    - Параметры: `{ order_id: string, old_status: string, new_status: string }`

3. **payment_status_success** - Успешный платеж

    - Параметры: `{ order_id: string, order_uuid: string, amount: string, amount_usdt: string }`

4. **payment_status_error** - Ошибка загрузки статуса

    - Параметры: `{ order_id: string, error: string }`

5. **payment_status_order_id_copied** - Скопирован ID заявки

    - Параметры: `{ order_id: string, order_uuid: string }`

6. **payment_status_home_clicked** - Клик "На главную"
    - Параметры: `{ order_id: string, order_uuid: string, status: string }`

---

## Детали транзакции (`src/app/history/[hash]/page.tsx`)

1. **transaction_detail_page_opened** - Открытие страницы деталей транзакции

    - Параметры: `{ transaction_hash: string }`

2. **transaction_detail_back_clicked** - Возврат назад

    - Параметры: `{ transaction_hash: string }`

3. **transaction_hash_copied** - Скопирован хэш транзакции

    - Параметры: `{ transaction_hash: string }`

4. **transaction_id_copied** - Скопирован ID транзакции

    - Параметры: `{ transaction_hash: string, transaction_id: string }`

5. **transaction_address_copied** - Скопирован адрес получателя

    - Параметры: `{ transaction_hash: string }`

6. **transaction_link_clicked** - Клик по ссылке в explorer

    - Параметры: `{ transaction_hash: string, url: string }`

7. **transaction_tax_modal_opened** - Открытие модалки о комиссии

    - Параметры: `{ transaction_hash: string }`

8. **transaction_tax_modal_closed** - Закрытие модалки о комиссии
    - Параметры: `{ transaction_hash: string }`

---

## История транзакций (`src/app/history/page.tsx` + `HistoryItem.tsx`)

1. **history_page_opened** - Открытие страницы истории

    - Параметры: `{ items_count: number }`

2. **history_tab_changed** - Смена таба фильтрации

    - Параметры: `{ tab: string, items_count: number }`

3. **history_transaction_clicked** - Клик по транзакции

    - Параметры: `{ transaction_hash: string, transaction_type: string, transaction_status: string }`

4. **history_empty_state_action** - Действие из пустого состояния
    - Параметры: `{ action: 'refill_clicked' }`

---

## Пополнение кошелька (`src/app/refilled/page.tsx`)

1. **refill_page_opened** - Открытие страницы пополнения

    - Параметры: нет

2. **refill_page_closed** - Закрытие страницы пополнения

    - Параметры: нет

3. **refill_network_selected** - Выбрана сеть

    - Параметры: `{ network: string, crypto: string }`

4. **refill_continue_clicked** - Клик "Продолжить"
    - Параметры: `{ crypto: string, network: string }`

---

## Пополнение QR (`src/app/refilled/[crypto]/[network]/page.tsx`)

1. **refill_qr_page_opened** - Открытие страницы QR пополнения

    - Параметры: `{ crypto: string, network: string }`

2. **refill_qr_page_closed** - Закрытие страницы QR пополнения

    - Параметры: `{ crypto: string, network: string }`

3. **refill_address_copied** - Скопирован адрес пополнения

    - Параметры: `{ crypto: string, network: string, address: string }`

4. **refill_home_clicked** - Клик "Вернуться на главную"

    - Параметры: `{ crypto: string, network: string }`

5. **refill_min_amount_modal_opened** - Открытие модалки минимальной суммы

    - Параметры: `{ crypto: string, network: string }`

6. **refill_min_amount_modal_closed** - Закрытие модалки минимальной суммы

    - Параметры: `{ crypto: string, network: string }`

7. **refill_tax_modal_opened** - Открытие модалки комиссии

    - Параметры: `{ crypto: string, network: string }`

8. **refill_tax_modal_closed** - Закрытие модалки комиссии
    - Параметры: `{ crypto: string, network: string }`

---

## Профиль (`src/app/profile/page.tsx`)

1. **profile_page_opened** - Открытие страницы профиля

    - Параметры: нет

2. **profile_add_to_home_clicked** - Клик "Добавить на главный экран"

    - Параметры: нет

3. **profile_faq_clicked** - Клик перехода в FAQ
    - Параметры: нет

---

## FAQ (`src/app/faq/page.tsx` + `FaqItem.tsx`)

1. **faq_page_opened** - Открытие страницы FAQ

    - Параметры: нет

2. **faq_back_clicked** - Возврат назад из FAQ

    - Параметры: нет

3. **faq_question_opened** - Открытие вопроса

    - Параметры: `{ question: string }`

4. **faq_question_closed** - Закрытие вопроса
    - Параметры: `{ question: string }`

---

## Онбординг

### Step 1 (`src/components/onboarding/steps/Step1.tsx`)

1. **onboarding_started** - Начало онбординга

    - Параметры: нет

2. **onboarding_step_passed** - Прохождение шага
    - Параметры: `{ step_number: 1 }`

### Step 2 (`src/components/onboarding/steps/Step2.tsx`)

1. **onboarding_step_passed** - Прохождение шага
    - Параметры: `{ step_number: 2 }`

### Step 3 (`src/components/onboarding/steps/Step3.tsx`)

1. **onboarding_step_passed** - Прохождение шага
    - Параметры: `{ step_number: 3 }`

### Step 4 (`src/components/onboarding/steps/Step4.tsx`)

1. **onboarding_step_passed** - Прохождение шага
    - Параметры: `{ step_number: 4 }`

### Step 5 (`src/components/onboarding/steps/Step5.tsx`)

1. **wallet_deposit_screen_opened** - Открытие экрана пополнения кошелька

    - Параметры: нет

2. **wallet_deposit_address_copied** - Скопирован адрес пополнения

    - Параметры: нет

3. **wallet_deposit_confirmed** - Подтверждено пополнение

    - Параметры: нет

4. **wallet_deposit_later** - Отложено пополнение
    - Параметры: нет

### Step 6 (`src/components/onboarding/steps/Step6.tsx`)

1. **wallet_deposit_success** - Успешное пополнение кошелька
    - Параметры: `{ amount: number }`

---

## Навигация и общие компоненты

### NavBottom (`src/components/NavBottom.tsx`)

1. **page_view** - Просмотр страницы

    - Параметры: `{ page: string }`

2. **button_clicked** - Клик по кнопке
    - Параметры: `{ button_name: string }`

### Wallets (`src/components/main/Wallets.tsx`)

1. **button_clicked** - Клик по кнопке
    - Параметры: `{ button_name: string }`

---

## Итого

Всего событий: **81**

### По категориям:

-   QR Сканирование: **12** событий
-   Оплата по ссылке: **11** событий
-   Статус платежа: **6** событий
-   Детали транзакции: **8** событий
-   История транзакций: **4** события
-   Пополнение кошелька: **12** событий (4 + 8)
-   Профиль: **3** события
-   FAQ: **4** события
-   Онбординг: **10** событий
-   Навигация и общие: **3** события

### Примечания:

-   Все дефолтные события Telemetree (TS Click, TS PageView, TS Error, TS Load) блокируются
-   Все пользовательские события отправляются через единый `TelemetryProvider`
-   Каждое событие содержит контекстную информацию для анализа
