/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   init.c                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mbastard <mbastard@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/10/01 14:15:12 by mbastard          #+#    #+#             */
/*   Updated: 2022/10/24 18:44:39 by mbastard         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../includes/minishell.h"

static void	init_histo(t_data *data)
{
	int		fd;
	char	*line;
	char	*pwd;

	pwd = malloc(1028 * sizeof(char));
	getcwd(pwd, 1028);
	data->histo_path = ft_strjoin(pwd, "/History", 1, 0);
	fd = open(data->histo_path, O_RDWR | O_CREAT, 0644);
	line = get_next_line(fd);
	while (line)
	{
		add_history(line);
		if (line)
			free(line);
		line = get_next_line(fd);
	}
	close(fd);
}

void	init_data(t_data *data, char **envp)
{
	data->exp = ft_tabdup(envp, NULL);
	data->env = ft_tabdup(envp, NULL);
	data->fd[0] = dup(0);
	data->fd[1] = dup(1);
	data->status = 0;
	data->sa.sa_handler = sig_hand;
	data->sa.sa_flags = SA_RESTART;
	sigaction(SIGQUIT, &data->sa, NULL);
	sigaction(SIGINT, &data->sa, NULL);
	init_histo(data);
}
