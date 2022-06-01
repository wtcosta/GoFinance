import React, { useCallback, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useFocusEffect } from '@react-navigation/native'

import { HighlighCard } from '../../components/HighlighCard';
import { TransactionCard, TransactionCardProps } from '../../components/TransactionCard';

import { 
    Container,
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

export function Dashboard(){
    const [data, setData] = useState<DataListProps[]>([]);

    async function loadTransactions(){
        const dataKey = '@gofinances:transactions'
        const response = await AsyncStorage.getItem(dataKey)
        const transactions = response ? JSON.parse(response) : [];
        console.info(transactions)
        const transactionsFormatted: DataListProps[] = transactions.map((item: DataListProps) => {
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

        setData(transactionsFormatted)
    }

    useEffect(() => {
        loadTransactions();
    }, [])

    useFocusEffect(useCallback(() => {
        loadTransactions()
    }, []))

    return (
        <Container>
            <Header>
                <UserWrapper>
                    <UserInfo>
                        <Photo source={{uri: 'https://avatars.githubusercontent.com/u/8378135?s=400&u=76ea444b45fd76e8dd0a1a9c659eea60073e592d&v=4'}}/>
                        <User>
                            <UserGreeting>Olá, </UserGreeting>
                            <UserName>Wesley</UserName>
                        </User>
                    </UserInfo>

                    <LogoutButton onPress={() => {}}>
                        <Icon name="power" />
                    </LogoutButton>
                </UserWrapper>
            </Header>

            <HighlighCards>
                <HighlighCard
                    type="up"
                    title="Entrada"
                    amount="R$ 14.400,00"
                    lastTransaction="Última entrada dia 13 de abril"
                />
                <HighlighCard
                    type="down"
                    title="Saida"
                    amount="R$ 1.259,00"
                    lastTransaction="Última saida dia 03 de abril"
                />
                <HighlighCard
                    type="total"
                    title="Total"
                    amount="R$ 16.141,00"
                    lastTransaction="01 à 16 de abril"
                />
            </HighlighCards>

            <Transactions>
                <Title>Listagem</Title>

                <TansactionList
                    data={data}
                    keyExtractor={item => item.id}
                    renderItem={(({item}) => <TransactionCard data={item} />)}
                />
            </Transactions>
        </Container>
    )
}