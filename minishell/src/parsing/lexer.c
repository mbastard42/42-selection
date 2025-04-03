/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   lexer.c                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mbastard <mbastard@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/10/01 14:13:49 by mbastard          #+#    #+#             */
/*   Updated: 2022/10/21 19:22:15 by mbastard         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../../includes/minishell.h"

static size_t	count_div(char *input)
{
	size_t	i;
	size_t	div;
	char	**tab;
	char	**tmp;

	i = -1;
	div = 0;
	tab = ft_split_exept(input, "|><", "\"\'", 0);
	while (tab && tab[++i])
	{
		tmp = ft_split_exept(tab[i], " \t\n", "\"\'", 1);
		div += ft_tablen(tmp, NULL);
		free_tab(tmp);
	}
	free_tab(tab);
	return (div);
}

static void	fill_div(char **tab, char *input)
{
	size_t	i;
	size_t	j;
	size_t	div;
	char	**dup;
	char	**tmp;

	i = -1;
	j = -1;
	div = -1;
	dup = ft_split_exept(input, "|><", "\"\'", 0);
	while (dup && dup[++i])
	{
		j = -1;
		tmp = ft_split_exept(dup[i], " \t\n", "\"\'", 1);
		while (tmp && tmp[++j])
			tab[++div] = ft_strdup(tmp[j]);
		free_tab(tmp);
	}
	free_tab(dup);
	tab[++div] = NULL;
}

char	**lexer(char *input)
{
	size_t	len;
	char	**tokens;

	len = count_div(input);
	tokens = (char **)malloc((len + 1) * sizeof(char *));
	if (!tokens)
		return (NULL);
	fill_div(tokens, input);
	if_free(input);
	return (tokens);
}
