import { SignOutButton } from '@/components/SignOutButton'
import { useUser } from '@clerk/clerk-expo'
import { Ionicons } from "@expo/vector-icons"
import { useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import { Alert, FlatList, Image, RefreshControl, Text, TouchableOpacity, View } from 'react-native'
import { styles } from '../../assets/styles/home.styles'
import { BalanceCard } from '../../components/BalanceCard'
import { NoTransactionsFound } from '../../components/NoTransactionsFound'
import PageLoader from "../../components/PageLoader"
import { TransactionItem } from '../../components/TransactionItem'
import { userTransactions } from '../../hooks/userTransactions'

export default function Page() {
  const { user } = useUser()
  const router = useRouter()
  const [refreshing, setRefreshing] = useState(false)
  const { transactions, summary, isLoading, loadData, deleteTransaction } = userTransactions(user.id)

  const onRefresh = async () => {
    setRefreshing(true)
    await loadData()
    setRefreshing(false)
  }

  const handleDelete = (id) => {
      Alert.alert("Delete Transaction", "Are you sure you want to delete this transaction?", [
        {text: "Cancel", style: "cancel"},
        {text: "Delete", style: "destructive", onPress: () => deleteTransaction(id)}
      ])
    }

  useEffect(() => {
    loadData()
  }, [loadData]);

  if(isLoading && !refreshing) return <PageLoader />

  return (
    <View style={styles.container}>

      <View style={styles.content}>
        {/* header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Image
              source={require("../../assets/images/react-logo.png")}
              style={styles.headerLogo}
              resizeMode='contain'
            />
            <View style={styles.welcomeContainer}>
              <Text style={styles.welcomeText}>Welcome, </Text>
              <Text style={styles.usernameText}>
                {user?.emailAddresses[0]?.emailAddress.split("@")[0]}
              </Text>
            </View>
          </View>

          <View style={styles.headerRight}>
            <TouchableOpacity 
              style={styles.addButton} 
              onPress={() => {
                router.push("/create")
              }}
            >
              <Ionicons name="add" size={20} color="#FFF" />
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
            <SignOutButton />
          </View>
        </View>
        {/* Middle part */}
        <BalanceCard summary={summary} />
      </View>

        {/* Last Part */}
      <FlatList 
        style={styles.transactionsList}
        contentContainerStyle={styles.transactionsListContent}
        data={transactions}
        renderItem={({item}) => (
          <TransactionItem item={item} onDelete={handleDelete} />
        )}
        ListEmptyComponent={<NoTransactionsFound />}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}
      />
    </View>
  )
}