import React, { useCallback, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useFocusEffect } from '@react-navigation/native'
import { ActivityIndicator } from 'react-native'
import { useTheme } from 'styled-components'

import { HighlighCard } from '../../components/HighlighCard';
import { TransactionCard, TransactionCardProps } from '../../components/TransactionCard';
import { useAuth } from '../../hooks/auth';

import { 
    Container,
    LoadContainer,
    Header,
    UserWrapper,
    UserInfo,
    Photo,
    User,
    UserGreeting,
    UserName,
    Icon,
    HighlighCards,
    Transactions,
    Title,
    TansactionList,
    LogoutButton
} from './styles'

export interface DataListProps extends TransactionCardProps {
    id: string;
}

interface HighlightProps {
    amount: string
    lastTransaction: string
}

interface HighlightData{
    entries: HighlightProps
    expensives: HighlightProps
    total: HighlightProps
}

function getLastTransactionDate(collection: DataListProps[], type: 'positive' | 'negative'){
    const lastTransaction = new Date(Math.max.apply(Math, collection
        .filter(transaction => transaction.type === type)
        .map(transaction => new Date(transaction.date).getTime())))

    return `${lastTransaction.getDate()} de ${lastTransaction.toLocaleString('pt-BR', {
        month: 'long'
    })}`
}

export function Dashboard(){
    const [isLoading, setIsLoading] = useState(true)
    const [transactions, setTransactions] = useState<DataListProps[]>([]);
    const [highlightData, setHighlightData] = useState<HighlightData>({} as HighlightData)

    const theme = useTheme()
    const { signOut, user } = useAuth()

    let entriesTotal = 0
    let expensiveTotal = 0

    async function loadTransactions(){
        const dataKey = '@gofinances:transactions'
        const response = await AsyncStorage.getItem(dataKey)
        const transactions = response ? JSON.parse(response) : [];
        const transactionsFormatted: DataListProps[] = transactions.map((item: DataListProps) => {
            if (item.type == 'positive') {
                entriesTotal += Number(item.amount)
            }else{
                expensiveTotal += Number(item.amount)
            }

            const amount = Number(item.amount).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            })

            const date = Intl.DateTimeFormat('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: '2-digit',
            }).format(new Date(item.date))

            return {
                id: item.id,
                title: item.name,
                amount,
                type: item.type,
                category: item.category,
                date
            }
        })

        const total = entriesTotal - expensiveTotal

        setTransactions(transactionsFormatted)

        const lastTransactionsEntries = getLastTransactionDate(transactions, 'positive')
        const lastTransactionsExpensives = getLastTransactionDate(transactions, 'negative')
        const totalInterval = `01 a ${lastTransactionsExpensives}`

        setHighlightData({
            expensives: {
                amount: expensiveTotal.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                }),
                lastTransaction: `Última saida dia ${lastTransactionsExpensives}`
            },
            entries: {
                amount: entriesTotal.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                }),
                lastTransaction: `Últime entrada dia ${lastTransactionsEntries}`
            },
            total: {
                amount: total.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                }),
                lastTransaction: `${totalInterval}`
            }
        })
        setIsLoading(false)
    }

    useEffect(() => {
        loadTransactions();
    }, [])

    useFocusEffect(useCallback(() => {
        loadTransactions()
    }, []))

    return (
        <Container>
            { isLoading ? 
                <LoadContainer>
                    <ActivityIndicator
                        color={theme.colors.primary}
                        size="large"
                    />
                </LoadContainer>
                : 
                <>
                    <Header>
                        <UserWrapper>
                            <UserInfo>
                                <Photo source={{uri: user.photo}}/>
                                <User>
                                    <UserGreeting>Olá, </UserGreeting>
                                    <UserName>{user.name}</UserName>
                                </User>
                            </UserInfo>

                            <LogoutButton onPress={signOut}>
                                <Icon name="power" />
                            </LogoutButton>
                        </UserWrapper>
                    </Header>

                    <HighlighCards>
                        <HighlighCard
                            type="up"
                            title="Entrada"
                            amount={highlightData.entries.amount}
                            lastTransaction={highlightData.entries.lastTransaction}
                        />
                        <HighlighCard
                            type="down"
                            title="Saida"
                            amount={highlightData.expensives.amount}
                            lastTransaction={highlightData.expensives.lastTransaction}
                        />
                        <HighlighCard
                            type="total"
                            title="Total"
                            amount={highlightData.total.amount}
                            lastTransaction={highlightData.total.lastTransaction}
                        />
                    </HighlighCards>

                    <Transactions>
                        <Title>Listagem</Title>

                        <TansactionList
                            data={transactions}
                            keyExtractor={item => item.id}
                            renderItem={(({item}) => <TransactionCard data={item} />)}
                        />
                    </Transactions>
                </>
            }
        </Container>
    )
}