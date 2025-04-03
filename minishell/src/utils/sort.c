/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   sort.c                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mbastard <mbastard@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/10/24 20:11:59 by mbastard          #+#    #+#             */
/*   Updated: 2022/10/24 20:45:36 by mbastard         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../../includes/minishell.h"

static int	check_sort(char **tab)
{
	int	i;

	i = -1;
	while (tab[++i + 1])
		if (ft_strncmp(tab[i], tab[i +1], ft_sublen(tab[i], 0)) > 0)
			return (0);
	return (1);
}

static void	tab_switch(char **s1, char **s2)
{
	char	*tmp;

	tmp = ft_strdup(*s1);
	free(*s1);
	*s1 = ft_strdup(*s2);
	free(*s2);
	*s2 = ft_strdup(tmp);
	free(tmp);
}

void	ft_sort_by_ascii(char **tab)
{
	int		i;

	while (!check_sort(tab))
	{
		i = -1;
		while (tab[++i + 1])
			if (ft_strncmp(tab[i], tab[i +1], ft_sublen(tab[i], 0)) > 0)
				tab_switch(&tab[i], &tab[i + 1]);
	}
}
