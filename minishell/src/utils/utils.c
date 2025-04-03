/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   utils.c                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mbastard <mbastard@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/10/17 18:12:35 by mbastard          #+#    #+#             */
/*   Updated: 2022/10/24 20:46:03 by mbastard         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../../includes/minishell.h"

int	ft_chainlen(t_cmd *cmd)
{
	int		i;
	t_cmd	*view;

	i = 0;
	view = cmd;
	while (view)
	{
		i++;
		view = view->next;
	}
	return (i);
}

void	if_free(void *mem)
{
	if (mem)
		free(mem);
}

void	free_tab(char **tab)
{
	int	i;

	i = -1;
	while (tab && tab[++i])
		free(tab[i]);
	if_free(tab);
}

int	isin(char *set, char c)
{
	int	in;

	in = 0;
	if (ft_strchr(set, c, 0))
		in++;
	return (in);
}

void	print_tab(char **tab)
{
	size_t	i;

	i = -1;
	while (tab && tab[++i])
		printf("%s\n", tab[i]);
}
