/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_split_exept.c                                   :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mbastard <mbastard@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/09/15 20:12:24 by mbastard          #+#    #+#             */
/*   Updated: 2022/10/20 23:10:33 by mbastard         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../../includes/minishell.h"

static size_t	setlen(const char *str, char *set, char *exept)
{
	size_t	i;
	char	in;

	i = 0;
	in = 0;
	while (str && str[i])
	{
		if (str[i] == in)
			in = 0;
		else if (!in && exept && ft_strchr(exept, str[i], 0))
			in = str[i];
		else if (!in && set && ft_strchr(set, str[i], 0))
			return (i);
		i++;
	}
	return (i);
}

char	**ft_split_exept(char *str, char *set, char *exept, int trim)
{
	size_t	i;
	size_t	len;
	char	**tab;

	i = 0;
	tab = NULL;
	while (trim && ft_strchr(set, str[i], 0))
			i++;
	while (str && str[i])
	{
		len = setlen(&str[i], set, exept);
		if (!len && !trim)
			tab = tabadd(tab, ft_substr(str, i, len), 1, 1);
		if (!len)
			len++;
		tab = tabadd(tab, ft_substr(str, i, len), 1, 1);
		i += len;
		while (trim && ft_strchr(set, str[i], 0))
			i++;
	}
	return (tab);
}
