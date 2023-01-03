import ExpensesOutput from "../components/ExpensesOutput/ExpensesOutput";
import { useContext, useEffect, useState } from "react";
import { ExpensesContext } from "../store/expenses-context";
import { fetchExpense } from "../util/http";
import LoadingOverlay from "../components/ExpensesOutput/UI/LoadingOverlay";
function RecentExpenses() {
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState();
  const expensesCtx = useContext(ExpensesContext);
  // const [fetchedExpenses, setFetchedExpenses] = useState([]);
  useEffect(() => {
    async function getExpenses() {
      setIsFetching(true);
      try {
        const expenses = await fetchExpense();
      } catch (error) {
        setError('Could not fetch expenses. Please try again later!');
      }
      // setFetchedExpenses(expenses);
      setIsFetching(false);
      expensesCtx.setExpenses(expenses);
    }
    getExpenses();
  }, []);
  function errorHandler(){
    setError(null);
  }
  if(error && !isFetching){
    return <ErrorOverlay message={error} onConfirm={errorHandler}/>
  }
  if (isFetching) {
    return <LoadingOverlay />;
  }
  const recentExpenses = expensesCtx.expenses.filter((expense) => {
    const today = new Date();
    const expenseDate = new Date(expense.date);
    const diffTime = Math.abs(today - expenseDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  });
  return (
    <ExpensesOutput
      expenses={recentExpenses}
      expensesPeriod="Last 7 days"
      fallbackText="No expenses registed for the last 7 days!"
    />
  );
}
export default RecentExpenses;
