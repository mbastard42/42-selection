/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   main.c                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mbastard <mbastard@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/10/01 13:32:03 by mbastard          #+#    #+#             */
/*   Updated: 2022/10/24 20:58:33 by mbastard         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../includes/minishell.h"

int	main(int argc __unused, char **argv __unused, char **envp)
{
	t_data	data;

	init_data(&data, envp);
	while (42)
	{
		open_redirect(data.fd[0], data.fd[1]);
		if (write(0, "\0", 1) == -1)
			data.status = 130;
		else if (parser(&data, lexer(read_input(&data))) && \
			write(0, "", 1) > -1)
		{
			launch_cmds(&data, NULL);
			while (waitpid(-1, &data.status, 0) > 0)
				data.status = (WEXITSTATUS(data.status));
			del_cmds(&data.cmds);
		}
	}
	return (0);
}
