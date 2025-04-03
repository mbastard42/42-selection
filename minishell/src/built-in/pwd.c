/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   pwd.c                                              :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mbastard <mbastard@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/09/14 18:08:09 by mbastard          #+#    #+#             */
/*   Updated: 2022/10/19 01:45:16 by mbastard         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../../includes/minishell.h"

int	pwd(t_data *mini)
{
	char	cwd[1024];

	if (!ft_strncmp(mini->cmds->argv[0], "pwd", 3))
	{
		getcwd(cwd, sizeof(cwd));
		while (access(cwd, F_OK) == -1)
		{
			cd("..", mini);
			getcwd(cwd, sizeof(cwd));
		}
		printf("Current working dir: %s\n", cwd);
	}
	return (0);
}
