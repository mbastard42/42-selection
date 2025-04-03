/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   exit.c                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mbastard <mbastard@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/10/19 01:40:53 by mbastard          #+#    #+#             */
/*   Updated: 2022/10/21 17:03:28 by mbastard         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../../includes/minishell.h"

void	exiting(t_data *data, t_cmd *cmd)
{
	if (cmd && ft_tablen(cmd->argv, NULL) > 2)
		ft_fprintf(data->fd[1], "%s: Too many args\n", cmd->argv[0]);
	else
	{
		free_tab(data->env);
		free_tab(data->exp);
		if_free(data->histo_path);
		if (cmd && cmd->argv[1] && !is_stralnum(cmd->argv[1], 0, 1))
		{
			ft_fprintf(data->fd[1], "%s: Numeric args required\n", cmd->argv[1]);
			exit(255);
		}
		if (!cmd || !cmd->argv[1])
			exit(data->status);
		else if (!cmd->argv[2])
			exit(ft_atoi(cmd->argv[1]) % 256);
	}
}
