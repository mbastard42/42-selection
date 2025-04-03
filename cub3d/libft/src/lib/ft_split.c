/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_split.c                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mbastard <mbastard@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2021/11/25 16:46:52 by mbastard          #+#    #+#             */
/*   Updated: 2022/11/25 02:54:57 by mbastard         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../../includes/libft.h"

char	**ft_split(const char *str, char c)
{
	unsigned long	i;
	unsigned long	div;
	char			**tab;

	i = -1;
	div = 1;
	if (!str)
		return (NULL);
	while (str[++i])
		if (str[i] == c && str[i + 1] != c && str[i + 1])
			div++;
	tab = (char **)ft_calloc(div + 1, sizeof(char *));
	if (!tab)
		return (NULL);
	i = -1;
	div = -1;
	while (str[++i])
		if (str[i] != c && (str[i - 1] == c || !i))
			tab[++div] = ft_substr(str, i, ft_strlen(&str[i], c));
	tab[++div] = NULL;
	return (tab);
}
