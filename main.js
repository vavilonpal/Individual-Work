const fs = require('fs');
const path = require('path');

class TransactionAnalyzer {

    parsedData = []
    /**
     * Коснтруткор для сохрания транзакий в отедельную переменную
     * @param {path} filePath - передаём ссылку на файл транзакций
     * @description Cохраенние тразнакций в параметр parsedData
     */
    constructor(filePath) {
        try {
            const fileData = fs.readFileSync(filePath, 'utf-8')
            this.parsedData = JSON.parse(fileData)

        } catch (error) {
            console.error("Error for reading file")
            this.parsedData = null
        }
    }
    /**
     * Добавялем новую транзакцию 
     */
    addTransaction() {
        let newTransaction = {};

        newTransaction.transaction_id = this.parsedData.length + 1;
        newTransaction.transaction_date = prompt("Введите дату транзакции (гггг-мм-дд): ");
        newTransaction.transaction_amount = parseFloat(prompt("Введите сумму транзакции: "));
        newTransaction.transaction_type = prompt("Введите тип транзакции (debit/credit): ");
        newTransaction.transaction_description = prompt("Введите описание транзакции: ");
        newTransaction.merchant_name = prompt("Введите название магазина: ");
        newTransaction.card_type = prompt("Введите тип карты: ");

        this.parsedData.push(newTransaction)
        console.log("Новая транзакция:", newTransaction);

    }
    /**
     * 
     * @returns Возвращает массив со всеми транзакциями
     */
    getAllTransaction() {
        if (!(Array.isArray(this.parsedData) && this.parsedData.length > 0)) {
            return console.log("Введены неправиильные значения сумм")
        }
        return this.parsedData
    }
    /**
     * 
     * @description 1) Получаем все униакльные типы транзакций
     * @returns {Set} - Возвращает массив всех типов уникальных транзакций
     * 
     * getUniqueTransactionType() =>
     * ['debit', 'credit']
     */

    getUniqueTransactionType() {
        const uniqueTransactionTypes = new Set();
        if (!(Array.isArray(this.parsedData) && this.parsedData.length > 0)) {
            return console.log("Введены неправиильные значения сумм")
        }
        for (const transaction of this.parsedData) {
            uniqueTransactionTypes.add(transaction.transaction_type);
        }


        return uniqueTransactionTypes;
    }
    /**
     * @description  Рассчитывает общую сумму всех транзакций
     * @returns {number}  общая сумма всех транзакций
     */
    // 
    calculateTotalAmount() {
        let totalAmount = 0
        if (!(Array.isArray(this.parsedData) && this.parsedData.length > 0)) {
            return console.log("Введены неправиильные значения сумм")
        }
            for (const transaction of this.parsedData) {
                totalAmount = totalAmount + transaction.transaction_amount;
            }
        return totalAmount;
    }
    /**
     * @description
        
     * @param {int} year 
     * @param {int} month 
     * @param {int} day 
     * @returns {int} Возвращает сумму по указанной дате
     */
    calculateTotalAmountByDate(year, month, day) {
        if (!this.parsedData) {
            console.error("No transaction data available.");
            return 0.0;
        }

        let totalAmount = 0.0;

        this.parsedData.forEach(transaction => {
            const transactionDate = new Date(transaction.transaction_date);
            if (
                (year === undefined || transactionDate.getFullYear() === year) &&
                (month === undefined || transactionDate.getMonth() + 1 === month) && 
                (day === undefined || transactionDate.getDate() === day)
            ) {
                totalAmount += transaction.transaction_amount;
            }
        });

        return totalAmount;
    }
    /**
     * @description Возвращает транзакции указанного типа (debit или credit).
     * @param {string} type - передаваемый тип кари
     * @returns {Array} Возвращает массив транзакий указанного типа
     */
    getTransactionByType(type) {
        const transactionByTypes = new Set();

        if (!(Array.isArray(this.parsedData) && this.parsedData.length > 0)) {
            return console.log("Введены неправиильные значения сумм")
        }
            for (const transaction of this.parsedData) {
                if (transaction.transaction_type == type) {
                    transactionByTypes.add(transaction);
                }
            }
        
        return transactionByTypes
    }
    /**
     * @description 5) Возвращает транзакции, проведенные в указанном диапазоне дат от `startDate` до `endDate`.
     * @param {string} startDate - Дата с которой начинается возврат транзакций
     * @param {string} endDate - Дата до которой идёт возврат транзакций
     * @returns {Array} Возвращает массив транзакций по указанному промежутку времени транзакций
     * 
     * Пример вводимых параметров
     * getTransactionsInDateRange("2019-01-09", "2019-2-09")
     */
    getTransactionsInDateRange(startDate, endDate) {
        const transactionByDate = new Set();

       
        let firstDate = parseInt(startDate.replace(/-/g, ''));
        let secondDate = parseInt(endDate.replace(/-/g, ''));

        if (!(Array.isArray(this.parsedData) && this.parsedData.length > 0)) {
            return console.log("Введены неправиильные значения сумм")
        }
     
            if (firstDate < secondDate) {
                for (const transaction of this.parsedData) {
                   
                    let currentDate = parseInt(transaction.transaction_date.replace(/-/g, ''));
         
                    if (currentDate >= firstDate && currentDate <= secondDate) {
                        transactionByDate.add(transaction)
                    }
                }
            }
            else return console.log("Некоректо введены значения дат")
        
        return transactionByDate
    }
    /**
     * @description Возвращает транзакции, совершенные с указанным торговым местом или компанией.
     * @param {string} merchantName - параметр с названиеем торгового места или компании
     * @returns {Array} Возврашает массив транзакций с указанным торговым местом или компанией
     */
    getTransactionsByMerchant(merchantName) {
        transactionsByMerchantName = new Set();
        if (!(Array.isArray(this.parsedData) && this.parsedData.length > 0)) {
            return console.log("Введены неправиильные значения сумм")
        }
            for (const transaction of this.parsedData) {
                if (merchantName == transaction.merchant_name) {
                    transactionsByMerchantName.add(transaction);
                }
            }
        return transactionsByMerchantName

    }
    /**
     * @description Возвращает среднее значение транзакций.
     * @returns {int} Среднее значение транзакций
     */
    calculateAverageTransactionAmount() {
        let totalAmount = 0
        let counter = this.parsedData.length
        if (!(Array.isArray(this.parsedData) && this.parsedData.length > 0)) {
            return console.log("Введены неправиильные значения сумм")
        }
            for (const transaction of this.parsedData) {
                totalAmount = totalAmount + transaction.transaction_amount;
            }
        
        return totalAmount / counter;

    }
    /**
     * @description Возвращает транзакции с суммой в заданном диапазоне от minAmount до maxAmount.
     * @param {int} minAmount - Начальный диапозон суммы
     * @param {int} maxAmount - Конечный диапозон суммы
     * @returns {array} Массив транзакций в диапозоне указанных сумм
     */
    getTransactionsByAmountRange(minAmount, maxAmount) {
        const transactionByAmount = new Set();

        if (!(Array.isArray(this.parsedData) && this.parsedData.length > 0)) {
            return console.log("Введены неправиильные значения сумм")
        }

        if (maxAmount > minAmount) {
            for (const transaction of this.parsedData) {
                if (transaction.transaction_amount >= minAmount && transaction.transaction_amount <= maxAmount) {
                    transactionByAmount.add(transaction)
                }
            }
        }

        return transactionByAmount;
    }
    /**
     * @description Вычисляет общую сумму дебетовых транзакций.
     * @returns {int} Сумму всех депитовых транзакций.
     */
    calculateTotalDebitAmount() {
        let debitAmount = 0
        if (!(Array.isArray(this.parsedData) && this.parsedData.length > 0)) {
            return console.log("Введены неправиильные значения сумм")
        }
            for (const transaction of this.parsedData) {
                if (transaction.transaction_type == "debit") {
                    debitAmount = debitAmount + transaction.transaction_amount
                }
            }
        
        return debitAmount;
    }
    /**
     * @description Метод возвращает месяц, в котором было больше всего транзакций.
     * @returns {Array} возвращает массив с месяцом или месяцами
     * 
     * Пример воз. значения: [ [ '01', [ 'Januray', 31 ] ], [ '03', [ 'March', 31 ] ] ]
     *  '01'- нумерация месяца
     *  'Januray'-название
     *  31 - количесто транзакций с этим месяцом
     */
    findMostTransactionsMonth() {
        const monthDictionary = {
            "01": ["Januray", 0],
            "02": ["February", 0],
            "03": ["March", 0],
            "04": ["April", 0],
            "05": ["May", 0],
            "06": ["June", 0],
            "07": ["July", 0],
            "08": ["August", 0],
            "09": ["Sebtember", 0],
            "10": ["October", 0],
            "11": ["November", 0],
            "12": ["December", 0]
        }
        if (!(Array.isArray(this.parsedData) && this.parsedData.length > 0)) {
            return console.log("Введены неправиильные значения сумм")
        }
            for (const transaction of this.parsedData) {
                let dateArray = transaction.transaction_date.split("-");
           
                monthDictionary[dateArray[1]][1] = monthDictionary[dateArray[1]][1] + 1;
            }
            let monthArray = Object.entries(monthDictionary);
            monthArray.sort((a, b) => a[1][1] - b[1][1]);
            for (let i = monthArray.length - 1; i >= 0; i--) {
                if (monthArray[i][1][1] != monthArray[i - 1][1][1]) {
                    monthArray.splice(0, i);
                    break;
                }
            }
            return monthArray
        
    }
    /**
     * @description Возвращает месяц, в котором было больше дебетовых транзакций.
     * @returns {Array} Возвращает массив с месяцом или месяцами
     * Пример получаемого массива: [ [ '03', [ 'March', 24 ] ], [ '04', [ 'April', 24 ] ] ]
     * '03'-нумерцаия месяца
     * 'March'-название
     *  24 - кол-во дебитовых транзакций в данном месяце
     */
    findMostDebitTransactionMonth() {
        const monthDictionary = {
            "01": ["Januray", 0],
            "02": ["February", 0],
            "03": ["March", 0],
            "04": ["April", 0],
            "05": ["May", 0],
            "06": ["June", 0],
            "07": ["July", 0],
            "08": ["August", 0],
            "09": ["Sebtember", 0],
            "10": ["October", 0],
            "11": ["November", 0],
            "12": ["December", 0]
        }
        if (!(Array.isArray(this.parsedData) && this.parsedData.length > 0)) {
            return console.log("Введены неправиильные значения сумм")
        }
            for (const transaction of this.parsedData) {
                if (transaction.transaction_type == "debit") {
                    let dateArray = transaction.transaction_date.split("-");
                    monthDictionary[dateArray[1]][1] = monthDictionary[dateArray[1]][1] + 1;
                }


            }
            let monthArray = Object.entries(monthDictionary);
            monthArray.sort((a, b) => a[1][1] - b[1][1]);
            console.log(monthArray)
            for (let i = monthArray.length - 1; i >= 0; i--) {
                if (monthArray[i][1][1] != monthArray[i - 1][1][1]) {
                    monthArray.splice(0, i);
                    break;

                }
            }
            return monthArray
        
    }
    /**
     * @returns
        1. Возвращает каких транзакций больше всего.
        2. Возвращает `debit`, если дебетовых.
        3. Возвращает `credit`, если кредитовых.
        4. Возвращает `equal`, если количество равно.
     * 
     */
    mostTransactionTypes() {
        
        let cardsArray = [0, 0];
        if (!(Array.isArray(this.parsedData) && this.parsedData.length > 0)) {
            return console.log("Введены неправиильные значения сумм")
        }
            for (const transaction of this.parsedData) {
                if (transaction.transaction_type == "debit") {
                    cardsArray[0] = cardsArray[0] + 1;
                }
                else if (transaction.transaction_type == "credit") {
                    cardsArray[1] = cardsArray[1] + 1;
                }
            }
            if (cardsArray[0] > cardsArray[1]) {
                return "debit"
            }
            else if (cardsArray[0] < cardsArray[1]) {
                return "credit"
            }
            else if (cardsArray[0] == cardsArray[1]) {
                return "equals"
            }
        
    }
    /**
     * @description Возвращает транзакции, совершенные до указанной даты.
     * @param {string} date 
     * Пример вводимого значения: "2019-01-04"
     * 
     * @returns {array} - возвращает массив транзакций до определнноц даты
     */
    getTransactionsBeforeDate(date) {
        let transactionBeforeDate = new Set()
        let finalDate = parseInt(date.replace(/-/g, ''));

        if (!(Array.isArray(this.parsedData) && this.parsedData.length > 0)) {
            return console.log("Введены неправиильные значения сумм")
        }

            for (const transaction of this.parsedData) {
                let currentDate = parseInt(transaction.transaction_date.replace(/-/g, ''));
                if (currentDate < finalDate) {
                    transactionBeforeDate.add(transaction)
                }
                else return console.log("Некоректо введены значения даты")
            }
        
        return transactionBeforeDate;

    }
    /**
     * @description озвращает транзакцию по ее уникальному идентификатору.
     * @param {int} id - id искомой транзакции
     * @returns {object} - взвращает транзакцию
     */
    findTransactionById(id) {
        return this.parsedData[id - 1];
    }
    /**
     * @description Возвращает новый массив, содержащий только описания транзакций.
     * @returns {array} - массв описаний транзакций
     */
    mapTransactionDescriptions() {
        const desciptionArray = new Set();
        if (!(Array.isArray(this.parsedData) && this.parsedData.length > 0)) {
            return console.log("Введены неправиильные значения сумм")
        }
            for (const transaction of this.parsedData) {
                desciptionArray.push(transaction.transaction_description)

            }
        
        return desciptionArray;
    }



}



const filePath = "transaction.json"
const transactions = new TransactionAnalyzer(filePath)
