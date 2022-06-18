import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { ActivityIndicator } from 'react-native'
import { VictoryPie } from 'victory-native'
import { RFValue } from 'react-native-responsive-fontsize';
import { useTheme } from 'styled-components'
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import { addMonths, subMonths, format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

import { HistoryCard } from '../../components/HistoryCard'
import { categories } from '../../utils/categories';

import {
    LoadContainer,
    Container,
    Header,
    Title,
    Content,
    ChartContainner,
    MonthSelect,
    MonthSelectButton,
    MonthSelectIcon,
    Month,
} from './style'

interface TransactionData{
    type: 'positeve' | 'negative';
    name: string;
    amount: string;
    category: string;
    date: string;
}

interface CategoryData{
    key: string;
    name: string;
    total: number;
    totalFormatted: string;
    color: string;
    percent: string;
}

export function Resume(){
    const [isLoading, setIsLoading] = useState(true)
    const [selectedDate, setSelectedDate] = useState(new Date())
    const [totalByCategories, setTotalByCategory] = useState<CategoryData[]>([])

    const theme = useTheme()

    function handlDateChange(action: 'next' | 'prev'){
        setIsLoading(true)
        if (action == 'next') {
            setSelectedDate(addMonths(selectedDate, 1))
        }else{
            setSelectedDate(subMonths(selectedDate, 1))
        }
    }

    async function loadData(){
        const dataKey = '@gofinances:transactions'
        const response = await AsyncStorage.getItem(dataKey)
        const responseFormatted = response ? JSON.parse(response) : []

        const expensives = responseFormatted
        .filter((expensive:TransactionData) => 
            expensive.type === 'negative'
            && new Date(expensive.date).getMonth() === selectedDate.getMonth()
            && new Date(expensive.date).getFullYear() === selectedDate.getFullYear()
        )

        const expensivesTotal = expensives.reduce((acumullator: number, expensive: TransactionData) => {
            return acumullator += Number(expensive.amount)
        }, 0)

        const totalByCategory: CategoryData[] = [];

        categories.forEach(category => {
            let categorySum = 0;
            expensives.forEach((expensive:TransactionData) => {
                if (expensive.category === category.key) {
                    categorySum += Number(expensive.amount)
                }
            })

            if (categorySum > 0) {
                const totalFormatted = categorySum
                    .toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                    })

                const percent = `${(categorySum / expensivesTotal * 100).toFixed(0)}%`

                totalByCategory.push({
                    key: category.key,
                    name: category.name,
                    color: category.color,
                    total: categorySum,
                    totalFormatted,
                    percent
                })
            }
        })

        setTotalByCategory(totalByCategory)
        setIsLoading(false)
    }

    useEffect(() => {
        loadData();
    }, [selectedDate])

    return(
        <Container>
            <Header>
                <Title>Resumo por categoria</Title>
            </Header>
            { isLoading ? 
                <LoadContainer>
                    <ActivityIndicator
                        color={theme.colors.primary}
                        size="large"
                    />
                </LoadContainer>
                : 
                <Content
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{
                        paddingBottom: useBottomTabBarHeight(),
                        paddingHorizontal: 24,
                    }}
                >
                    <MonthSelect>
                        <MonthSelectButton onPress={() => handlDateChange('prev')}>
                            <MonthSelectIcon name="chevron-left"/>
                        </MonthSelectButton>

                        <Month>{format(selectedDate, 'MMMM, yyyy', {locale: ptBR})}</Month>

                        <MonthSelectButton onPress={() => handlDateChange('next')}>
                            <MonthSelectIcon name="chevron-right"/>
                        </MonthSelectButton>
                    </MonthSelect>

                    <ChartContainner>
                        <VictoryPie
                            data={totalByCategories}
                            colorScale={totalByCategories.map(category => category.color)}
                            style={{
                                labels: {
                                    fontSize: RFValue(18),
                                    fontWeight: 'bold',
                                    fill: theme.colors.shape,
                                }
                            }}
                            labelRadius={80}
                            x="percent"
                            y="total"
                        />
                    </ChartContainner>
                    {
                        totalByCategories.map(item => (
                            <HistoryCard
                                key={item.key}
                                title={item.name}
                                amount={item.totalFormatted}
                                color={item.color}
                            />
                        ))
                    }
                </Content>
            }
        </Container>
    )
}