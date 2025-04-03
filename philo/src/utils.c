/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   utils.c                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mbastard <mbastard@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/04/08 21:14:00 by mbastard          #+#    #+#             */
/*   Updated: 2022/06/29 17:33:01 by mbastard         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../includes/philo.h"

size_t	ft_sublen(const char *str, char c)
{
	size_t	len;

	len = 0;
	if (str)
	{
		while (str[len] != c && str[len])
			len++;
		if (!str[len] && c)
			return (0);
	}
	return (len);
}

char	*ft_strchr(const char *str, char c, int gap)
{
	int	i;

	i = -1;
	if (str)
		while (str[++i])
			if (str[i] == c)
				return ((char *)&str[i + gap]);
	return (NULL);
}

int	ft_atoi(const char *str)
{
	int	sign;
	int	result;

	sign = 1;
	result = 0;
	if (ft_strchr("-+0123456789", *str, 0))
	{
		if (*str == 45)
			sign = -1;
		if (ft_strchr("0123456789", *str, 0))
			result = result * 10 + (*str - 48);
		while (ft_strchr("0123456789", *++str, 0))
			result = result * 10 + (*str - 48);
	}
	return (result * sign);
}

void	*ft_calloc(size_t n, size_t size)
{
	void	*mem;
	size_t	len;

	len = n * size;
	mem = malloc(len);
	if (!mem)
		return (NULL);
	while (len--)
		((unsigned char *)mem)[len] = 0;
	return (mem);
}
