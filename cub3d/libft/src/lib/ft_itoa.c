/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_itoa.c                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mbastard <mbastard@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2021/11/25 17:26:33 by mbastard          #+#    #+#             */
/*   Updated: 2022/11/23 06:20:22 by mbastard         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../../includes/libft.h"

static char	*ft_calloc_str(int n)
{
	int		len;
	char	*str;

	len = 1;
	if (n == -2147483648)
		n++;
	if (n < 0 && ++len)
		n *= -1;
	while (n > 9 && ++len < 11)
		n = n / 10;
	str = (char *)ft_calloc(len + 1, sizeof(char));
	if (!str)
		return (NULL);
	str[0] = len;
	return (str);
}

char	*ft_itoa(int n)
{
	int		len;
	char	*str;

	str = ft_calloc_str(n);
	if (!str)
		return (NULL);
	len = str[0];
	if (n == -2147483648 && --len)
	{
		str[len] = '8';
		n = -214748364;
	}
	if (n < 0)
	{
		str[0] = '-';
		n *= -1;
	}
	while (--len >= 0 && str[len] != '-')
	{
		str[len] = (n % 10) + 48;
		n /= 10;
	}
	return (str);
}
