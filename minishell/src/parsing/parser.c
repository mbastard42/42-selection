/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   parser.c                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mbastard <mbastard@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/10/14 20:20:06 by mbastard          #+#    #+#             */
/*   Updated: 2022/10/24 16:33:47 by mbastard         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../../includes/minishell.h"

int	parser(t_data *data, char **tokens)
{
	size_t	i;
	char	**tmp;

	i = 0;
	tmp = NULL;
	data->cmds = NULL;
	while (tokens && tokens[i])
	{
		tmp = ft_tabdup(&tokens[i], "|");
		i += ft_tablen(tmp, NULL);
		if (!ft_strncmp(tokens[i], "|", 2))
			i++;
		add_cmd(&data->cmds, new_cmd(data, tmp));
	}
	free_tab(tokens);
	return (i);
}
