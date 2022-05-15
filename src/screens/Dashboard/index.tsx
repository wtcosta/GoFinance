import React from 'react';

import { HighlighCard } from '../../components/HighlighCard';
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
} from './styles'

export function Dashboard(){
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

                    <Icon name="power" />
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
        </Container>
    )
}