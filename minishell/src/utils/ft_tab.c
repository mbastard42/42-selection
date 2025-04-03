/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_tab.c                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mbastard <mbastard@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/09/15 05:15:14 by mbastard          #+#    #+#             */
/*   Updated: 2022/10/24 20:45:20 by mbastard         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../../includes/minishell.h"

char	**ft_tabdup(char **tab, char *end)
{
	int		i;
	char	**dup;

	i = -1;
	if (!tab)
		return (NULL);
	dup = (char **)malloc((ft_tablen(tab, end) + 1) * sizeof(char *));
	if (!dup)
		return (NULL);
	while (tab[++i] && ft_strncmp(tab[i], end, ft_sublen(end, 0) + 1))
		dup[i] = ft_strdup(tab[i]);
	dup[i] = NULL;
	return (dup);
}

char	**tabadd(char **tab, char *str, int clean, int clean_str)
{
	int		i;
	char	**dup;

	i = 0;
	if (!str)
		return (tab);
	dup = (char **)malloc((ft_tablen(tab, NULL) + 2) * sizeof(char *));
	if (dup)
	{
		while (tab && tab[i])
		{
			dup[i] = ft_strdup(tab[i]);
			i++;
		}
		dup[i] = ft_strdup(str);
		dup[i + 1] = NULL;
	}
	if (clean && tab)
		free_tab(tab);
	if (clean_str)
		if_free(str);
	return (dup);
}

char	*tabtostr(char **tab, int clean_tab)
{
	size_t	i;
	char	*str;

	i = -1;
	str = NULL;
	while (tab && tab[++i])
		str = ft_strjoin(str, tab[i], 1, 0);
	if (clean_tab && tab)
		free_tab(tab);
	return (str);
}

char	**tabjoin(char **t1, char **t2, int clean_t1, int clean_t2)
{
	size_t	div;
	char	**dest;

	div = -1;
	dest = NULL;
	while (t1 && t1[++div])
		dest = tabadd(dest, t1[div], 1, 0);
	div = -1;
	while (t2 && t2[++div])
		dest = tabadd(dest, t2[div], 1, 0);
	dest[ft_tablen(t1, NULL) + ft_tablen(t2, NULL)] = NULL;
	if (clean_t1 && t1)
		free_tab(t1);
	if (clean_t2 && t2)
		free_tab(t2);
	return (dest);
}

char	**tabdelete(char **tab, size_t pos, int clean)
{
	size_t	div;
	char	**dup;

	div = -1;
	dup = NULL;
	if (!tab)
		return (NULL);
	while (tab[++div])
		if (div != pos)
			dup = tabadd(dup, tab[div], 1, 0);
	if (clean)
		free_tab(tab);
	return (dup);
}
