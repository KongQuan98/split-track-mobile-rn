// react custom hook file

import { useCallback, useState } from "react"
import { Alert } from "react-native";
import { API_URL } from "../constants/api";

export const userTransactions = (userId) => {
    const [transactions, setTransactions] = useState([]);
    const [summary, setSummary] = useState({
        balance: 0,
        income: 0,
        expenses: 0,
    });
    const [isLoading, setIsLoading] = useState(true);

    // userCallback to memoize the function, optimization
    const fetchTransactions = useCallback(async () => {
        try {
            const response = await fetch(`${API_URL}/transactions/${userId}`, { method: "GET"})
            const data = await response.json()
            console.log("data:", data)
            setTransactions(data);
        } catch (error) {
            console.error("Error fetching transactions:", error)
        }
    }, [userId]);

    const fetchSummary = useCallback(async () => {
        try {
            const response = await fetch(`${API_URL}/transactions/summary/${userId}`, { method: "GET"})
            const data = await response.json()
            console.log("data:", data)
            setSummary(data);
        } catch (error) {
            console.error("Error fetching summary:", error)
        }
    }, [userId]);

    const loadData = useCallback( async () => {
        if(!userId) return;
        
        setIsLoading(true)
        try {
            // can be run in parallel
            await Promise.all([fetchTransactions(), fetchSummary()])
        } catch (error) {
            console.error("Error loading data:", error)
        } finally {
            setIsLoading(false)
        }
    }, [fetchTransactions, fetchSummary, userId])

     const deleteTransaction = async (id) => {        
        try {
            const response = await fetch(`${API_URL}/transactions/${id}`, { method: "DELETE"})
            if(!response.ok) throw new Error("Failed to delete transaction.");

            // Refresh data after deleted
            loadData()
            Alert.alert("Success", "Transaction deleted successfully.")
        } catch (error) {
            console.error("Error deleteing transaction:", error)
            Alert.alert("Error", error.message)
        } finally {
            setIsLoading(false)
        }
    }

    return { transactions, summary, isLoading, loadData, deleteTransaction}
}

