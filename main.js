const fs = require('fs');
const path = require('path');

class TransactionAnalyzer{
   
    mySet = new Set();
    parsedData = []
    /**
     * Коснтруткор для сохрания транзакий в отедельную переменную
     * @param {path} filePath - передаём ссылку на файл транзакций
     * @description Cохраенние тразнакций в параметр parsedData
     */
    constructor(filePath){
        try{
            //Считываем файл
            const fileData = fs.readFileSync(filePath, 'utf-8')
            this.parsedData = JSON.parse(fileData)
           
        //Сохраняем в обьект значение null  при некоректном парсинге .json файла
        }catch(error){
            console.error("Error for reading file")
            this.parsedData = null
        }
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
    
        if (Array.isArray(this.parsedData) && this.parsedData.length > 0) {
            for (const transaction of this.parsedData) {
                uniqueTransactionTypes.add(transaction.transaction_type);
            }
        }
    
        return uniqueTransactionTypes;
    }
    /**
     * @description 2) Рассчитывает общую сумму всех транзакций
     * @returns {int} Возвращает общую сумму всех транзакций
     */
    // 
    calculateTotalAmount(){
        let totalAmount = 0
        // Проверка на наличие элементов внутри массива транзакций
        if (Array.isArray(this.parsedData) && this.parsedData.length > 0) {
            for (const transaction of this.parsedData) {
                totalAmount = totalAmount + transaction.transaction_amount;
            }
        }
        return totalAmount;
    }
    /**
     * @description
        1. Вычисляет общую сумму транзакций за указанный год, месяц и день.
        2. Параметры year, month и day являются необязательными.
        3. В случае отсутствия одного из параметров, метод производит расчет по остальным.
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
                (month === undefined || transactionDate.getMonth() + 1 === month) && // Месяцы в JS начинаются с 0
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
    getTransactionByType(type){
        const transactionByTypes = new Set();

        if (Array.isArray(this.parsedData) && this.parsedData.length > 0) {
            for (const transaction of this.parsedData) {
                if(transaction.transaction_type == type){
                    transactionByTypes.add(transaction);
                }
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
    getTransactionsInDateRange(startDate, endDate){
        const transactionByDate = new Set();

        //1.С помощью метода .replace(/-/g, '') удаляем тире между числами
        //2. Преобразуем даты в числовой формат
        let firstDate = parseInt(startDate.replace(/-/g, ''));  
        let secondDate = parseInt(endDate.replace(/-/g, ''));

        if (Array.isArray(this.parsedData) && this.parsedData.length > 0) {
            //Первая дата должна быть меньше второй, чтобы перебор работал 
            if(firstDate < secondDate){
                for (const transaction of this.parsedData) {
                    // Сохраняем дату текущей транзакции и преобразуем её в число
                    let currentDate = parseInt(transaction.transaction_date.replace(/-/g, ''));
                    //Добавялем в массив только те транзакции, временной промежуток которых
                    //удовлетворяет нашему условию
                    if( currentDate >= firstDate && currentDate <= secondDate){
                        transactionByDate.add(transaction)
                    }
                }
            }
            else return console.log("Некоректо введены значения дат")
        }
        return transactionByDate
    }
    /**
     * @description Возвращает транзакции, совершенные с указанным торговым местом или компанией.
     * @param {string} merchantName - параметр с названиеем торгового места или компании
     * @returns {Array} Возврашает массив транзакций с указанным торговым местом или компанией
     */
    getTransactionsByMerchant(merchantName){
        transactionsByMerchantName = new Set();
        if (Array.isArray(this.parsedData) && this.parsedData.length > 0) {
            for (const transaction of this.parsedData) {
                if(merchantName == transaction.merchant_name){
                    transactionsByMerchantName.add(transaction);
                }
            }
        }
        return transactionsByMerchantName
        
    }
    /**
     * @description Возвращает среднее значение транзакций.
     * @returns {int} Среднее значение транзакций
     */
    calculateAverageTransactionAmount(){
        let totalAmount = 0
        let counter = this.parsedData.length
        if (Array.isArray(this.parsedData) && this.parsedData.length > 0) {
            for (const transaction of this.parsedData) {
                //Cчитаем сумму значений транзакций
                totalAmount = totalAmount + transaction.transaction_amount;
            }
        }
        return totalAmount / counter;

    }
    /**
     * @description Возвращает транзакции с суммой в заданном диапазоне от minAmount до maxAmount.
     * @param {int} minAmount - Начальный диапозон суммы
     * @param {int} maxAmount - Конечный диапозон суммы
     * @returns {array} Массив транзакций в диапозоне указанных сумм
     */
    getTransactionsByAmountRange(minAmount, maxAmount){
        const transactionByAmount = new Set();

        if (Array.isArray(this.parsedData) && this.parsedData.length > 0) {
            // Метод выполняется только в случае если конечное значение сумм больше начального
            if(maxAmount > minAmount){
                for (const transaction of this.parsedData) {
                    if(transaction.transaction_amount >= minAmount && transaction.transaction_amount <= maxAmount){
                        transactionByAmount.add(transaction)
                    }
                }
            }
            else return console.log("Введены неправиильные значения сумм")
        }
        return transactionByAmount;
    }
    /**
     * @description Вычисляет общую сумму дебетовых транзакций.
     * @returns {int} Сумму всех депитовых транзакций.
     */
    calculateTotalDebitAmount(){
        let debitAmount = 0
        if (Array.isArray(this.parsedData) && this.parsedData.length > 0) {
            for (const transaction of this.parsedData) {
                if(transaction.transaction_type == "debit"){
                   debitAmount = debitAmount + transaction.transaction_amount 
                }
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
    findMostTransactionsMonth(){
        const monthDictionary = {
            "01":["Januray", 0],
            "02":["February",0],
            "03":["March",0],
            "04":["April",0],
            "05":["May",0],
            "06":["June",0],
            "07":["July",0],
            "08":["August",0],
            "09":["Sebtember",0],
            "10":["October",0],
            "11":["November",0],
            "12":["December",0]
        }
        if (Array.isArray(this.parsedData) && this.parsedData.length > 0) {
            for (const transaction of this.parsedData) {
                //создаём массив, в котором первое значение это год, второе месяц, а третье день
                let dateArray = transaction.transaction_date.split("-");
                //далее месяц передаём как ключ, тем самым обращаясь к опред.значению 
                // и увеличивая его на 1, в monthDictionary
                // то есть мы для каждого месяца считаем кол-во транзакций
                monthDictionary[dateArray[1]][1] = monthDictionary[dateArray[1]][1] + 1;      
            }
            // Переменная которая нужна для перечисления словаря monthDictionary
            let monthArray = Object.entries(monthDictionary);
            // Сортируем массив по второму элементу вложенных списков         
            monthArray.sort((a, b) => a[1][1] - b[1][1]);
            // Цикл, который начинается с конца массива и идет до его начала.
            for (let i = monthArray.length - 1; i >= 0; i--) {
                //Проверяем не равен ли текущий элемент предедущему элементу
                // по второму значению во вложенном массиве
                if(monthArray[i][1][1] != monthArray[i-1][1][1]){
                    // При срабатывании условия, удаляем все элементы, которые не равны большему элементу и выходим из цикла
                    // Если текущий элемент равен, то тогда он остаётся в массиве и мы можем
                    // получить два месяца с одинаковым кол-вом транзакций
                    monthArray.splice(0,i);
                    break;
                }
            }
            return monthArray            
        }
    }
    /**
     * @description Возвращает месяц, в котором было больше дебетовых транзакций.
     * @returns {Array} Возвращает массив с месяцом или месяцами
     * Пример получаемого массива: [ [ '03', [ 'March', 24 ] ], [ '04', [ 'April', 24 ] ] ]
     * '03'-нумерцаия месяца
     * 'March'-название
     *  24 - кол-во дебитовых транзакций в данном месяце
     */
    findMostDebitTransactionMonth(){
        const monthDictionary = {
            "01":["Januray", 0],
            "02":["February",0],
            "03":["March",0],
            "04":["April",0],
            "05":["May",0],
            "06":["June",0],
            "07":["July",0],
            "08":["August",0],
            "09":["Sebtember",0],
            "10":["October",0],
            "11":["November",0],
            "12":["December",0]
        }
        if (Array.isArray(this.parsedData) && this.parsedData.length > 0) {
            for (const transaction of this.parsedData) {
                if(transaction.transaction_type == "debit"){
                    //создаём массив, в котором первое значение это год, второе месяц, а третье день
                    let dateArray = transaction.transaction_date.split("-");
                    //далее месяц передаём как ключ, тем самым обращаясь к опред.значению 
                    // и увеличивая его на 1, в monthDictionary
                    // то есть мы для каждого месяца считаем кол-во транзакций
                    monthDictionary[dateArray[1]][1] = monthDictionary[dateArray[1]][1] + 1;
                }
                
                
            }
            // Переменная которая нужна для перечисления словаря monthDictionary
            let monthArray = Object.entries(monthDictionary);
            // Сортируем массив по второму элементу вложенных списков         
            monthArray.sort((a, b) => a[1][1] - b[1][1]);
            console.log(monthArray)
            for (let i = monthArray.length - 1; i >= 0; i--) {
                //Проверяем не равен ли текущий элемент предедущему элементу
                // по второму значению во вложенном массиве
                if(monthArray[i][1][1] != monthArray[i-1][1][1]){
                    // При срабатывании условия, удаляем все элементы, которые не равны большему элементу и выходим из цикла
                    // Если текущий элемент равен, то тогда он остаётся в массиве и мы можем
                    // получить два месяца с одинаковым кол-вом транзакций
                    monthArray.splice(0,i);
                    break;
                    
                }
            }
            return monthArray
        }
    }
    /**
     * @returns
        1. Возвращает каких транзакций больше всего.
        2. Возвращает `debit`, если дебетовых.
        3. Возвращает `credit`, если кредитовых.
        4. Возвращает `equal`, если количество равно.
     * 
     */
    mostTransactionTypes(){
        //Массив котором будет считаться кол-во дебитовых и кредитовых транзакций   
        // Первый элемент массива это кол-во дебитовых а второй кредитовых
        let cardsArray = [0,0];
        if (Array.isArray(this.parsedData) && this.parsedData.length > 0) {
            for (const transaction of this.parsedData) {
                //Сортировка в массив по критериям дебит и кредит
                if(transaction.transaction_type == "debit"){
                    cardsArray[0] = cardsArray[0] + 1; 
                }
                else if(transaction.transaction_type == "credit"){
                    cardsArray[1] = cardsArray[1] + 1;
                }
            }
            //Проверка на колчество карт
            if(cardsArray[0]> cardsArray[1]){
                return "debit"
            }
            else if(cardsArray[0] < cardsArray[1]){
                return "credit"
            }
            else if(cardsArray[0] == cardsArray[1]){
                return "equals"
            }
        }
    }
    /**
     * @description Возвращает транзакции, совершенные до указанной даты.
     * @param {string} date 
     * Пример вводимого значения: "2019-01-04"
     * 
     * @returns {array} - возвращает массив транзакций до определнноц даты
     */
    getTransactionsBeforeDate(date){
        let transactionBeforeDate = new Set()
        let finalDate = parseInt(date.replace(/-/g, ''));

        if (Array.isArray(this.parsedData) && this.parsedData.length > 0) {

            for (const transaction of this.parsedData) {
                // Сохраняем дату текущей транзакции и преобразуем её в число
                let currentDate = parseInt(transaction.transaction_date.replace(/-/g, ''));
                //Добавялем в массив только те транзакции, временной промежуток которых
                 //удовлетворяет нашему условию
                if( currentDate < finalDate){
                    transactionBeforeDate.add(transaction)
                }
                else return console.log("Некоректо введены значения даты")
            }
        }
        return transactionBeforeDate;
        
    }
    /**
     * @description озвращает транзакцию по ее уникальному идентификатору.
     * @param {int} id - id искомой транзакции
     * @returns {object} - взвращает транзакцию
     */
    findTransactionById(id){
        return this.parsedData[id-1]; 
    }
    /**
     * @description Возвращает новый массив, содержащий только описания транзакций.
     * @returns {array} - массв описаний транзакций
     */
    mapTransactionDescriptions(){
        const desciptionArray = new Set();
        if (Array.isArray(this.parsedData) && this.parsedData.length > 0) {
            for (const transaction of this.parsedData) {
                desciptionArray.push(transaction.transaction_description)
                
            }
        }
        return desciptionArray;
    }


}



const filePath = "transaction.json"

const transactions = new TransactionAnalyzer(filePath)
console.log(transactions.parsedData.length)




// --запись
// Преобразование объекта JavaScript в JSON-строку
//const updatedFileData = JSON.stringify(transactions, null, 2); 
//Запись обновленной JSON-строки обратно в файл
//fs.writeFileSync(filePath, updatedFileData, 'utf-8');