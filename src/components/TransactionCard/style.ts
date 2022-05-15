import styled, { css } from 'styled-components/native'
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize'
import { Feather } from '@expo/vector-icons'

export const Container = styled.View`
    background-color: ${({theme}) => theme.colors.shape};
    border-radius: 5px;
    padding: 14px 24px;
    margin-bottom: 16px;
`;

export const Title = styled.Text`
    color: ${({theme}) => theme.colors.text_dark};
    font-size: ${RFValue(14)}px;
    font-family: ${({theme}) => theme.fonts.regular};
`;

export const Amount = styled.Text`
    color: ${({theme}) => theme.colors.text_dark};
    font-size: ${RFValue(20)}px;
    font-family: ${({theme}) => theme.fonts.regular};
`;

export const Footer = styled.View`
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-top: 19px;
`;

export const Category = styled.View`
    flex-direction: row;
    align-items: center;
`;

export const Icon = styled(Feather)`
    color: ${({theme}) => theme.colors.text};
    font-size: ${RFValue(20)}px;
`;

export const CategoryName = styled.Text`
    font-size: ${RFValue(20)}px;
    color: ${({theme}) => theme.colors.text};
    margin-left: 17px;
    font-family: ${({theme}) => theme.fonts.regular};
`;

export const Date = styled.Text`
    font-size: ${RFValue(20)}px;
    color: ${({theme}) => theme.colors.text};
    font-family: ${({theme}) => theme.fonts.regular};
`;
